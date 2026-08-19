---
name: instantly-cli
description: Use the Instantly CLI and MCP server for cold email campaigns, leads, accounts, and inbox. Name every client as a profile. Confirm status (slug, workspace_id, workspace_name) before other commands. One process, one profile.
---

# Instantly CLI — agent skill

Public CLI (`npm i -g instantly-cli`). JSON on stdout. Node.js 18+.

**Name every client as a profile.** Confirm `status` / `whoami` (`profile`, `workspace_id`, `workspace_name`, `source`) before campaigns, health, or writes. One process, one profile. Never print or commit raw API keys.

## Default: one workspace (existing npm users)

`--profile` is **not** required for old single-key users.

Resolve order **without** `--profile` / `INSTANTLY_PROFILE`:

1. `--api-key`
2. `INSTANTLY_API_KEY`
3. cwd `.env` `INSTANTLY_API_KEY`
4. `~/.instantly/config.json` from `instantly login`

`instantly login` stamps `{ api_key, workspace_id, workspace_name }` onto `~/.instantly/config.json` (mode 0600). `status` / `whoami` print `profile: "default"` plus that bound pair — not null.

```bash
export INSTANTLY_API_KEY="your-key"
instantly status
# confirm profile, workspace_id, workspace_name, then:
instantly campaigns list
```

When `--workspace` is passed on this path, live id must match or the command aborts. Omitted: no extra flag required.

## Agency: name every client (including the house org)

Agencies should `login --profile <client>` for **every** key, including the house org. The slug is the client name agents use.

`~/.instantly/profiles/<slug>.json` = `{ api_key, workspace_id, workspace_name }` (mode 0600)

```bash
instantly login --profile client-a --api-key "$CLIENT_A_KEY"
instantly login --profile client-b --api-key "$CLIENT_B_KEY"
# does not write or overwrite ~/.instantly/config.json

export INSTANTLY_PROFILE=client-a
instantly status
# confirm slug + workspace_id + workspace_name, then:
instantly health
instantly campaigns list
```

Or per command: `--profile client-a`.

**Hard rails**

- One process, one profile. No `--all-profiles`. No `WORKSPACE_KEYS`. Do not iterate `~/.instantly/profiles`.
- When a profile is selected, it wins over a leftover cwd `.env` `INSTANTLY_API_KEY`.
- Reads and writes under `--profile` re-fetch the live workspace. If live id ≠ bound id, abort.
- Writes also require `--workspace <uuid>` matching the bound id (CLI) or `workspace_id` (MCP).
- When `--workspace` is passed on any path (default or profile), live id must match or abort.
- `profile list` / `status` / `whoami` always return `profile` (slug or `default`), `workspace_id`, `workspace_name`, `source`. Keys are redacted.

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

One MCP server process per profile. Set `INSTANTLY_PROFILE=client-a` (or `INSTANTLY_API_KEY` for the default single-key workspace). Every tool description says pass `profile` for agency. Mutating tools require `profile` + `workspace_id` matching the bound pair. Call `status` first. There is no “run across all profiles” tool.

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
