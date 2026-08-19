---
name: instantly-cli
description: Use the Instantly CLI and MCP server for cold email campaigns, leads, accounts, and inbox. Default is one workspace. Agency mode is one named profile per process.
---

# Instantly CLI — agent skill

Public CLI (`npm i -g instantly-cli`). JSON on stdout. Node.js 18+.

## Default: one workspace

Resolve order **without** `--profile` / `INSTANTLY_PROFILE`:

1. `--api-key`
2. `INSTANTLY_API_KEY`
3. cwd `.env` `INSTANTLY_API_KEY`
4. `~/.instantly/config.json` from `instantly login`

```bash
export INSTANTLY_API_KEY="your-key"
instantly status
instantly campaigns list
```

`instantly login` writes only `~/.instantly/config.json` `{ api_key }` (mode 0600).

## Agency: one profile, one workspace

Opt-in. Profiles live **beside** default config, never inside it:

`~/.instantly/profiles/<slug>.json` = `{ api_key, workspace_id, workspace_name }` (mode 0600)

```bash
instantly login --profile client-a --api-key "$CLIENT_A_KEY"
instantly login --profile client-b --api-key "$CLIENT_B_KEY"
# does not write or overwrite ~/.instantly/config.json

export INSTANTLY_PROFILE=client-a
instantly status
instantly health
instantly campaigns list
```

Or per command: `--profile client-a`.

**Hard rails**

- One process, one workspace. No `--all-profiles`. No `WORKSPACE_KEYS`. Do not iterate `~/.instantly/profiles`.
- When a profile is selected, it wins over a leftover cwd `.env` `INSTANTLY_API_KEY`.
- Every profiled command re-fetches the live workspace. If live `workspace.id` ≠ bound `workspace_id`, abort.
- Writes require `--workspace <uuid>` matching the bound id (CLI) or `workspace_id` (MCP). Mismatch → abort.
- When `--workspace` is passed on any path (default or profile), live id must match or the command aborts. Omitted on the default single-key path: no extra flag required.
- `status` / `whoami` always print credential source, profile slug (if any), workspace id, and workspace name.

```bash
instantly --profile client-a --workspace "$CLIENT_A_WORKSPACE_ID" \
  campaigns activate "$CAMPAIGN_ID"
```

## Profile and health commands

```bash
instantly profile add client-a --api-key "$CLIENT_A_KEY"
instantly profile list
instantly profile whoami
instantly profile remove client-a
instantly health
instantly --profile client-a health
```

`logout` without `--profile` clears only `config.json`. `logout --profile client-a` removes only that profile file.

## Campaign bodies

Instantly delivers HTML. **Pass readable copy with real line breaks** in each variant `body`. The CLI converts plain-text newlines to `<br/>`/`<p>` on `campaigns create` / `update` and `subsequences create`. Do not send a run-on string. Do not hand-write HTML tags unless the body is already tagged. Existing HTML is left unchanged. `--text-only` skips conversion. Same Instantly `body` key — no second field.

The same convert-for-you path applies to `email reply`, `email forward`, and `leads bulk-add` custom_variables whose key contains `body`.

## Sequence delays

- Instantly uses only `sequences[0]`. Extra sequence objects are rejected.
- `delay` on step N waits **before step N+1**. The first campaign email sends on the campaign schedule and does **not** wait on `step[0].delay`.
- Pass `delay_unit` (`minutes` | `hours` | `days`). If omitted, the CLI sets `days`.
- Do not invent delay day values. A multi-step sequence with delay `0` or missing delay on a non-last step aborts (follow-up would send the same day). Last step delay may be `0`.
- `pre_delay` / `pre_delay_unit` apply **only to subsequences**. Do not set them on a normal campaign.
- `email_gap` is minutes between individual sends (rate limit), not the multi-day step gap.
- After create/update, read `sequence_timeline` (`Email 1: on campaign schedule; Email 2: +3 days after Email 1`).

## MCP

One MCP server process per workspace. Set `INSTANTLY_PROFILE=client-a` (or `INSTANTLY_API_KEY` for the default single-key workspace). Mutating tools require `workspace_id` matching the bound id when a profile is selected. There is no “run across all profiles” tool.

```json
{
  "mcpServers": {
    "instantly-client-a": {
      "command": "npx",
      "args": ["instantly-cli", "mcp"],
      "env": { "INSTANTLY_PROFILE": "client-a" }
    }
  }
}
```

## Discover commands

```bash
instantly --help
instantly campaigns --help
instantly campaigns create --help
```

Parse JSON. Exit 0 = success, 1 = error. Use `--fields` to shrink output.
