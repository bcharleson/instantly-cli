import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { allCommands } from '../../src/commands/index.js';
import { InstantlyClient } from '../../src/core/client.js';
import { createCommandContext } from '../../src/core/command-context.js';
import { isMutatingCommand } from '../../src/core/mutating.js';
import { saveProfile } from '../../src/core/profiles.js';
import { ValidationError, WorkspaceMismatchError } from '../../src/core/errors.js';

const CLIENT_A = '11111111-1111-4111-8111-111111111111';
const CLIENT_B = '22222222-2222-4222-8222-222222222222';

function commandsByGroup() {
  const groups = new Map<string, typeof allCommands>();
  for (const cmd of allCommands) {
    if (!groups.has(cmd.group)) groups.set(cmd.group, []);
    groups.get(cmd.group)!.push(cmd);
  }
  return groups;
}

describe('agency mode covers every API group', () => {
  const originalEnv = process.env;
  let getSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.INSTANTLY_API_KEY;
    delete process.env.INSTANTLY_PROFILE;
    getSpy = vi.spyOn(InstantlyClient.prototype, 'get');
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  async function seedProfiles(): Promise<void> {
    const home = await mkdtemp(join(tmpdir(), 'instantly-agency-groups-'));
    process.env.INSTANTLY_HOME = home;
    await saveProfile('client-a', {
      api_key: 'client-a-key',
      workspace_id: CLIENT_A,
      workspace_name: 'Client A',
    });
    await saveProfile('client-b', {
      api_key: 'client-b-key',
      workspace_id: CLIENT_B,
      workspace_name: 'Client B',
    });
  }

  it('registers the full Instantly API surface as one command set, not a profile-only subset', () => {
    const groups = commandsByGroup();
    expect(allCommands.length).toBeGreaterThanOrEqual(150);
    expect(groups.size).toBeGreaterThanOrEqual(31);
    for (const required of [
      'campaigns',
      'leads',
      'accounts',
      'email',
      'analytics',
      'webhooks',
      'lead-lists',
      'enrichment',
      'workspace',
    ]) {
      expect(groups.has(required), `missing group ${required}`).toBe(true);
    }
  });

  it('applies the same profile guard to every group: reads verify workspace, writes need --workspace', async () => {
    await seedProfiles();
    getSpy.mockImplementation(async () => ({ id: CLIENT_A, name: 'Client A' }));

    const groups = commandsByGroup();
    const proven: string[] = [];

    for (const [group, commands] of groups) {
      const readCmd = commands.find((cmd) => !isMutatingCommand(cmd));
      const writeCmd = commands.find((cmd) => isMutatingCommand(cmd));

      if (readCmd) {
        const ctx = await createCommandContext({
          profile: 'client-a',
          mutating: isMutatingCommand(readCmd),
        });
        expect(ctx.credentials.apiKey).toBe('client-a-key');
        expect(ctx.credentials.profile?.slug).toBe('client-a');
        expect(ctx.liveWorkspace?.id).toBe(CLIENT_A);
      }

      if (writeCmd) {
        await expect(
          createCommandContext({
            profile: 'client-a',
            mutating: true,
          }),
        ).rejects.toBeInstanceOf(ValidationError);

        await expect(
          createCommandContext({
            profile: 'client-a',
            workspace: CLIENT_B,
            mutating: true,
          }),
        ).rejects.toBeInstanceOf(WorkspaceMismatchError);

        const ctx = await createCommandContext({
          profile: 'client-a',
          workspace: CLIENT_A,
          mutating: true,
        });
        expect(ctx.credentials.apiKey).toBe('client-a-key');
      }

      proven.push(group);
    }

    expect(proven.length).toBe(groups.size);
    expect(getSpy.mock.calls.length).toBeGreaterThan(0);
  });

  it('resolves exactly one workspace even when two profiles exist on disk', async () => {
    await seedProfiles();
    getSpy.mockResolvedValue({ id: CLIENT_A, name: 'Client A' });

    const { listProfiles } = await import('../../src/core/profiles.js');
    const listed = await listProfiles();
    expect(listed.map((item) => item.slug).sort()).toEqual(['client-a', 'client-b']);

    const ctx = await createCommandContext({ profile: 'client-a', mutating: false });
    expect(ctx.credentials.apiKey).toBe('client-a-key');
    expect(ctx.credentials.profile?.workspace_id).toBe(CLIENT_A);
    expect(JSON.stringify(ctx.credentials)).not.toContain('client-b-key');
    expect(JSON.stringify(ctx.credentials)).not.toContain(CLIENT_B);
  });
});
