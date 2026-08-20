import { describe, it, expect } from 'vitest';
import { isMutatingCommand } from '../../src/core/mutating.js';
import { campaignsActivateCommand } from '../../src/commands/campaigns/activate.js';
import { campaignsListCommand } from '../../src/commands/campaigns/list.js';
import { campaignsPauseCommand } from '../../src/commands/campaigns/pause.js';
import { leadsBulkAddCommand } from '../../src/commands/leads/bulk-add.js';
import { leadsListCommand } from '../../src/commands/leads/list.js';
import { emailReplyCommand } from '../../src/commands/email/reply.js';
import { emailListCommand } from '../../src/commands/email/list.js';

describe('isMutatingCommand', () => {
  it('treats campaign activate/pause, leads bulk-add, and email reply as writes', () => {
    expect(isMutatingCommand(campaignsActivateCommand)).toBe(true);
    expect(isMutatingCommand(campaignsPauseCommand)).toBe(true);
    expect(isMutatingCommand(leadsBulkAddCommand)).toBe(true);
    expect(isMutatingCommand(emailReplyCommand)).toBe(true);
  });

  it('does not treat list/read endpoints as writes, including POST /leads/list', () => {
    expect(isMutatingCommand(campaignsListCommand)).toBe(false);
    expect(isMutatingCommand(emailListCommand)).toBe(false);
    expect(isMutatingCommand(leadsListCommand)).toBe(false);
  });
});
