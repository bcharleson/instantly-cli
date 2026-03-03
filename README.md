# Instantly CLI

**Instantly.ai in your terminal.** Run cold email campaigns, manage leads, monitor deliverability, and automate every outbound motion — from a single command line.

156 commands across 31 API groups. Full coverage of the [Instantly.ai](https://instantly.ai) V2 API. Built for humans, scripts, CI/CD pipelines, and AI agents.

```bash
npm install -g instantly-cli
```

---

## What is Instantly?

[Instantly.ai](https://instantly.ai) is the leading cold email and outbound sales platform. It handles everything needed to run high-volume outbound at scale:

- **Email infrastructure** — connect unlimited sending accounts (Google Workspace, Microsoft 365, SMTP/IMAP), auto-rotate senders, manage warmup
- **Campaign management** — multi-step email sequences with A/B testing, scheduling, and conditional logic
- **Lead management** — import, enrich, deduplicate, and track prospects across campaigns
- **Deliverability** — inbox placement testing, sender reputation monitoring, blocklist management, and warmup analytics
- **Unified inbox** — read, reply, and forward across all sending accounts from one place
- **AI features** — AI-powered lead labeling, interest classification, and response handling

## What This CLI Enables

The Instantly CLI gives you programmatic access to the entire platform. Every action you can take in the Instantly dashboard, you can do from your terminal:

**Campaign operations** — create campaigns, add leads, launch sequences, pause/resume, duplicate, and monitor sending status without opening a browser.

**Lead lifecycle** — import leads in bulk, move them between campaigns, update interest status, merge duplicates, assign to subsequences, and manage labels — all scriptable.

**Account management** — connect sending accounts, enable/disable warmup, test DNS/SMTP/IMAP health, pause underperforming senders, and monitor CTD (click-to-deliver) status.

**Deliverability monitoring** — run inbox placement tests, analyze where emails land (inbox vs. spam vs. promotions), track ESP-level performance, and get actionable insights.

**Analytics & reporting** — pull campaign stats, daily breakdowns, per-step sequence analytics, warmup performance, and account-level sending volumes into any reporting tool.

**Team & workspace admin** — manage workspace members, API keys, billing info, audit logs, and whitelabel domains.

**AI agent integration** — every command works as both a CLI subcommand and an MCP tool, so AI assistants (Claude, Cursor, Windsurf) can manage your outbound directly.

---

## Install

### npm (recommended)

```bash
npm install -g instantly-cli
```

### npx (zero-install)

```bash
npx instantly-cli campaigns list
```

### From source

```bash
git clone https://github.com/bcharleson/instantly-cli.git
cd instantly-cli
npm install && npm run build
npm link
```

---

## Authentication

Three ways to authenticate, checked in this order:

1. **`--api-key` flag** — pass on any command: `instantly campaigns list --api-key <key>`
2. **Environment variable** — `export INSTANTLY_API_KEY=your-key`
3. **Stored config** — run `instantly login` to save your key to `~/.instantly/config.json`

Get your API key from [app.instantly.ai/app/settings/integrations](https://app.instantly.ai/app/settings/integrations).

### For AI agents and scripts

Set the environment variable — no interactive prompts, no config files:

```bash
export INSTANTLY_API_KEY=your-key
instantly campaigns list
```

### Interactive login

```bash
instantly login
# Prompts for your API key, validates it, saves to ~/.instantly/config.json
```

---

## Quick Start

```bash
# Authenticate
instantly login

# List campaigns
instantly campaigns list

# Create a campaign and start sending
instantly campaigns create --name "Q2 Outreach"
instantly leads bulk-add --campaign-id <id> --leads '[{"email":"cto@startup.com","first_name":"Alex"}]'
instantly campaigns activate <id>

# Check analytics
instantly analytics campaign --id <id>

# Read replies
instantly email list --campaign-id <id> --is-read false

# Connect a Google sending account via OAuth
instantly oauth connect google
```

---

## Output Formats

Every command outputs JSON by default — ready for piping to `jq`, parsing in scripts, or feeding to other tools.

```bash
# Default: compact JSON
instantly campaigns list

# Pretty-printed JSON
instantly campaigns list --pretty

# Select specific fields
instantly campaigns list --fields "id,name,status"

# Suppress output (exit code only)
instantly campaigns list --quiet
```

---

## Commands

### Campaigns (11)

Create, manage, and control outbound email campaigns.

```bash
instantly campaigns list                              # List all campaigns (paginated)
instantly campaigns get <id>                          # Get full campaign details
instantly campaigns create --name "Q2 Outreach"       # Create a new campaign
instantly campaigns update <id> --name "Q2 Updated"   # Update campaign settings
instantly campaigns activate <id>                     # Start sending
instantly campaigns pause <id>                        # Pause sending
instantly campaigns duplicate <id>                    # Clone a campaign
instantly campaigns search-by-contact --email "a@b.com"  # Find campaigns containing a lead
instantly campaigns count-launched                    # Count active campaigns
instantly campaigns sending-status <id>               # Diagnose why a campaign isn't sending
instantly campaigns delete <id>                       # Delete permanently
```

### Leads (12)

Import, manage, and move prospects across campaigns.

```bash
instantly leads list --campaign-id <id>               # List leads in a campaign
instantly leads get <id>                              # Get lead details
instantly leads create --email "a@b.com" --campaign-id <id>  # Add a single lead
instantly leads update <id> --first-name "Jane"       # Update lead data
instantly leads bulk-add --campaign-id <id> --leads '[{"email":"a@b.com"}]'  # Add up to 1,000 leads
instantly leads bulk-delete --campaign-id <id> --delete-all  # Remove leads in bulk
instantly leads bulk-assign --lead-ids "id1,id2" --account-id <id>  # Assign leads to senders
instantly leads move --lead-ids "id1,id2" --to-campaign-id <id>  # Move between campaigns
instantly leads merge --lead-ids "id1,id2"            # Merge duplicate leads
instantly leads update-interest-status --lead-id <id> --interest-status 1  # Set interest level
instantly leads remove-from-subsequence --lead-id <id> --subsequence-id <id>
instantly leads delete <id>                           # Delete a lead
```

### Email Accounts (12)

Connect and manage sending accounts — SMTP/IMAP, Google, or Microsoft.

```bash
instantly accounts list                               # List all sending accounts
instantly accounts get <id>                           # Get account details
instantly accounts create --email "..." --smtp-host "..."  # Connect SMTP/IMAP account
instantly accounts update <email> --daily-limit 50    # Update account settings
instantly accounts warmup-enable --account-ids "id1,id2"  # Start warmup
instantly accounts warmup-disable --account-ids "id1,id2"  # Stop warmup
instantly accounts test-vitals <id>                   # Run DNS/SMTP/IMAP health checks
instantly accounts pause <email>                      # Pause an account
instantly accounts resume <email>                     # Resume a paused account
instantly accounts mark-fixed <email>                 # Clear error flags
instantly accounts ctd-status                         # Check click-to-deliver status
instantly accounts delete <id>                        # Remove account
```

### Email / Unified Inbox (8)

Read and respond to emails across all sending accounts.

```bash
instantly email list                                  # List all emails
instantly email list --campaign-id <id> --is-read false  # Unread replies for a campaign
instantly email get <id>                              # Get email content
instantly email reply --reply-to-uuid <id> --eaccount "user@domain.com" --subject "Re: Hello" --body-text "Thanks!"
instantly email forward --forward-uuid <id> --eaccount "user@domain.com" --to "team@co.com"
instantly email update <id> --is-read true            # Update email properties
instantly email delete <id>                           # Delete an email
instantly email mark-read <thread-id>                 # Mark entire thread as read
instantly email unread-count                          # Count unread emails
```

### Analytics (6)

Measure campaign performance at every level.

```bash
instantly analytics campaign                          # Stats for all campaigns
instantly analytics campaign --id <id>                # Stats for one campaign
instantly analytics campaign-overview                 # Aggregated overview
instantly analytics daily-campaign --campaign-id <id> # Day-by-day breakdown
instantly analytics campaign-steps --campaign-id <id> # Per-step sequence analytics
instantly analytics daily-account                     # Daily sending volume per account
instantly analytics warmup --emails "user@domain.com" # Warmup performance
```

### Webhooks (8)

Subscribe to real-time events from your campaigns.

```bash
instantly webhooks list                               # List all webhooks
instantly webhooks get <id>                           # Get webhook details
instantly webhooks create --url "https://..." --event-type lead_interested
instantly webhooks update <id> --url "https://..."    # Update webhook
instantly webhooks test <id>                          # Fire a test payload
instantly webhooks event-types                        # List available event types
instantly webhooks resume <id>                        # Re-enable a suspended webhook
instantly webhooks delete <id>                        # Delete webhook
```

### Webhook Events (4)

Inspect webhook delivery history.

```bash
instantly webhook-events list                         # List webhook events
instantly webhook-events get <id>                     # Get event details
instantly webhook-events summary                      # Event delivery summary
instantly webhook-events summary-by-date              # Summary grouped by date
```

### Lead Lists (6)

Manage reusable lead lists for imports and enrichment.

```bash
instantly lead-lists list                             # List all lead lists
instantly lead-lists get <id>                         # Get list details
instantly lead-lists create --name "Q2 Prospects"     # Create a list
instantly lead-lists update <id> --name "Updated"     # Rename a list
instantly lead-lists verification-stats <id>          # Email verification breakdown
instantly lead-lists delete <id>                      # Delete a list
```

### Enrichment / SuperSearch (10)

Enrich leads with company and contact intelligence.

```bash
instantly enrichment enrich --search-filters '{"job_titles":["CTO"]}' --limit 100
instantly enrichment count --search-filters '{"industries":["SaaS"]}'
instantly enrichment get <resource-id>                # Get enrichment settings
instantly enrichment run --resource-id <id>           # Trigger enrichment
instantly enrichment create --name "Q2" --search-filters '{}' --enrichment-settings '{}'
instantly enrichment update-settings <resource-id> --enrichment-settings '{}'
instantly enrichment ai --resource-id <id> --prompt "Find CTOs in SaaS"
instantly enrichment ai-progress <resource-id>        # Check AI enrichment status
instantly enrichment history <resource-id>            # View enrichment history
instantly enrichment preview --search-filters '{}'    # Preview matching leads
```

### Blocklist (5)

Prevent sending to specific domains or email addresses.

```bash
instantly blocklist list                              # List blocked entries
instantly blocklist get <id>                          # Get entry details
instantly blocklist create --value "spam@domain.com"  # Block an email/domain
instantly blocklist update <id> --value "new@domain.com"  # Update entry
instantly blocklist delete <id>                       # Remove from blocklist
```

### Custom Tags (6)

Organize campaigns, leads, and resources with tags.

```bash
instantly custom-tags list                            # List all tags
instantly custom-tags get <id>                        # Get tag details
instantly custom-tags create --label "High Priority"  # Create a tag
instantly custom-tags update <id> --label "Urgent"    # Rename a tag
instantly custom-tags toggle --tag-ids "t1" --resource-ids "r1" --resource-type 1 --assign
instantly custom-tags delete <id>                     # Delete a tag
```

### Custom Tag Mappings (1)

```bash
instantly custom-tag-mappings list                    # List tag-to-resource mappings
```

### Lead Labels (6)

AI-powered labeling to categorize lead reply intent.

```bash
instantly lead-labels list                            # List all labels
instantly lead-labels get <id>                        # Get label details
instantly lead-labels create --label "Hot Lead" --interest-status "positive"
instantly lead-labels update <id> --label "Warm Lead" # Update label
instantly lead-labels test-ai --reply-text "Yes, I'm interested"  # Test AI classification
instantly lead-labels delete <id>                     # Delete label
```

### Workspace (6)

Manage workspace settings and whitelabel configuration.

```bash
instantly workspace get                               # Get workspace info
instantly workspace update --name "My Workspace"      # Update workspace
instantly workspace whitelabel-create --domain "mail.example.com"
instantly workspace whitelabel-get                    # Get whitelabel domain
instantly workspace whitelabel-delete                 # Remove whitelabel
instantly workspace change-owner --email "new@co.com" # Transfer ownership
```

### Workspace Members (5)

Manage team access and roles.

```bash
instantly workspace-members list                      # List team members
instantly workspace-members get <id>                  # Get member details
instantly workspace-members create --email "user@co.com" --role admin
instantly workspace-members update <id> --role member # Change role
instantly workspace-members delete <id>               # Remove member
```

### Workspace Group Members (5)

Manage workspace group membership.

```bash
instantly workspace-group-members list                # List group members
instantly workspace-group-members get <id>            # Get member details
instantly workspace-group-members create --user-id <id> --group-id <id>
instantly workspace-group-members get-admin            # Get admin info
instantly workspace-group-members delete <id>         # Remove from group
```

### Workspace Billing (2)

```bash
instantly workspace-billing plan-details              # View current plan
instantly workspace-billing subscription-details      # View subscription info
```

### Subsequences (8)

Multi-branch sequences that trigger based on lead behavior.

```bash
instantly subsequences list --campaign-id <id>        # List subsequences
instantly subsequences create --campaign-id <id> --name "Follow-up" --conditions '{}' --schedule '{}' --sequences '[]'
instantly subsequences update <id> --name "New Name"  # Update subsequence
instantly subsequences duplicate <id> --campaign-id <target-id> --name "Copy"
instantly subsequences pause <id>                     # Pause sending
instantly subsequences resume <id>                    # Resume sending
instantly subsequences sending-status <id>            # Check sending status
instantly subsequences delete <id>                    # Delete subsequence
```

### Background Jobs (2)

Monitor async bulk operations.

```bash
instantly background-jobs list                        # List jobs
instantly background-jobs list --status completed --type import
instantly background-jobs get <id>                    # Get job details
```

### Email Verification (2)

Verify email addresses before sending.

```bash
instantly email-verification verify --email "john@example.com"
instantly email-verification status <email>           # Check verification result
```

### Account-Campaign Mappings (1)

```bash
instantly account-mappings get <email>                # See which campaigns use an account
```

### Audit Logs (1)

```bash
instantly audit-logs list                             # List workspace activity
instantly audit-logs list --start-date 2025-01-01 --end-date 2025-03-01
```

### API Keys (3)

```bash
instantly api-keys list                               # List API keys
instantly api-keys create --name "CI/CD Key" --scopes "campaigns:read,leads:read"
instantly api-keys delete <id>                        # Revoke an API key
```

### Inbox Placement (6)

Test where your emails land — inbox, spam, or promotions.

```bash
instantly inbox-placement list                        # List placement tests
instantly inbox-placement get <id>                    # Get test results
instantly inbox-placement create --name "Q2 Test" --type 0 --sending-method 0 --subject "Test" --body "Hello" --emails "seed@test.com"
instantly inbox-placement update <id> --name "Updated"
instantly inbox-placement esp-options                  # List ESP options
instantly inbox-placement delete <id>                 # Delete test
```

### Inbox Placement Analytics (5)

Deep-dive into deliverability data.

```bash
instantly inbox-placement-analytics list              # List analytics records
instantly inbox-placement-analytics get <id>          # Get analytics detail
instantly inbox-placement-analytics stats-by-test --test-ids "id1,id2"
instantly inbox-placement-analytics stats-by-date --test-id <id>
instantly inbox-placement-analytics insights --test-id <id>  # Deliverability insights
```

### Inbox Placement Reports (2)

```bash
instantly inbox-placement-reports list                # List reports
instantly inbox-placement-reports get <id>            # Get report details
```

### CRM Actions (2)

```bash
instantly crm-actions list-phone-numbers             # List phone numbers
instantly crm-actions delete-phone-number <id>       # Delete phone number
```

### DFY Orders (7)

Manage Done-For-You email account orders.

```bash
instantly dfy-orders list                             # List orders
instantly dfy-orders create --items '[...]'           # Place an order
instantly dfy-orders similar-domains --domain "example.com"  # Find similar domains
instantly dfy-orders check-domains --domains "a.com,b.com"   # Check domain availability
instantly dfy-orders pre-warmed                       # List pre-warmed domains
instantly dfy-orders list-accounts                    # List DFY accounts
instantly dfy-orders cancel --account-ids "id1,id2"   # Cancel accounts
```

### Custom Prompt Templates (5)

Manage AI prompt templates for personalized outreach.

```bash
instantly custom-prompt-templates list                # List templates
instantly custom-prompt-templates get <id>            # Get template
instantly custom-prompt-templates create --name "Opener" --prompt "Write an opener..."
instantly custom-prompt-templates update <id> --name "Updated"
instantly custom-prompt-templates delete <id>         # Delete template
```

### Sales Flow (5)

Manage automated sales workflows.

```bash
instantly sales-flow list                             # List sales flows
instantly sales-flow get <id>                         # Get flow details
instantly sales-flow create --name "Inbound Flow"     # Create flow
instantly sales-flow update <id> --name "Updated"     # Update flow
instantly sales-flow delete <id>                      # Delete flow
```

### Email Templates (5)

Manage reusable email templates.

```bash
instantly email-templates list                        # List templates
instantly email-templates get <id>                    # Get template
instantly email-templates create --name "Welcome" --subject "Hello" --body "..."
instantly email-templates update <id> --name "Updated"
instantly email-templates delete <id>                 # Delete template
```

### OAuth (connect email accounts)

Connect Google Workspace and Microsoft 365 accounts without SMTP credentials.

```bash
instantly oauth connect google                        # Opens browser for Google OAuth
instantly oauth connect microsoft                     # Opens browser for Microsoft OAuth
instantly oauth status <session-id>                   # Check connection status
```

---

## MCP Server

The CLI doubles as an [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server, giving AI assistants direct access to all 156 Instantly tools as native function calls.

```bash
instantly mcp
```

### What this means

When you configure `instantly mcp` as an MCP server in Claude, Cursor, VS Code, or Windsurf, your AI assistant can:

- Create and launch campaigns mid-conversation
- Look up lead data and analytics on demand
- Reply to emails, manage accounts, and run enrichment
- Automate multi-step outbound workflows end-to-end

Every `CommandDefinition` in the codebase powers both a CLI subcommand and an MCP tool — one source of truth, two interfaces.

### Configuration

Add to your MCP settings (Claude Desktop, Cursor, VS Code, Windsurf):

```json
{
  "mcpServers": {
    "instantly": {
      "command": "npx",
      "args": ["instantly-cli", "mcp"],
      "env": {
        "INSTANTLY_API_KEY": "your-api-key"
      }
    }
  }
}
```

This registers 156 tools across 31 groups:

| Group | Tools | Examples |
|-------|-------|---------|
| Campaigns | 11 | `campaigns_list`, `campaigns_activate`, `campaigns_duplicate` |
| Leads | 12 | `leads_list`, `leads_create`, `leads_bulk_add`, `leads_merge` |
| Accounts | 12 | `accounts_list`, `accounts_warmup_enable`, `accounts_pause` |
| Email | 8 | `email_list`, `email_reply`, `email_forward`, `email_update` |
| Analytics | 6 | `analytics_campaign`, `analytics_warmup`, `analytics_daily_campaign` |
| Webhooks | 8 | `webhooks_list`, `webhooks_create`, `webhooks_update` |
| Webhook Events | 4 | `webhook_events_list`, `webhook_events_summary` |
| Lead Lists | 6 | `lead_lists_list`, `lead_lists_create`, `lead_lists_verification_stats` |
| Enrichment | 10 | `enrichment_enrich`, `enrichment_ai`, `enrichment_preview` |
| Blocklist | 5 | `blocklist_list`, `blocklist_create`, `blocklist_update` |
| Custom Tags | 6 | `custom_tags_list`, `custom_tags_create`, `custom_tags_toggle` |
| Custom Tag Mappings | 1 | `custom_tag_mappings_list` |
| Lead Labels | 6 | `lead_labels_list`, `lead_labels_create`, `lead_labels_test_ai` |
| Workspace | 6 | `workspace_get`, `workspace_update`, `workspace_whitelabel_create` |
| Workspace Members | 5 | `workspace_members_list`, `workspace_members_create` |
| Workspace Group Members | 5 | `workspace_group_members_list`, `workspace_group_members_create` |
| Workspace Billing | 2 | `workspace_billing_plan_details`, `workspace_billing_subscription_details` |
| Subsequences | 8 | `subsequences_list`, `subsequences_create`, `subsequences_pause` |
| Background Jobs | 2 | `background_jobs_list`, `background_jobs_get` |
| Email Verification | 2 | `email_verification_verify`, `email_verification_status` |
| Account Mappings | 1 | `account_mappings_get` |
| Audit Logs | 1 | `audit_logs_list` |
| API Keys | 3 | `api_keys_create`, `api_keys_list`, `api_keys_delete` |
| Inbox Placement | 6 | `inbox_placement_list`, `inbox_placement_create` |
| Inbox Placement Analytics | 5 | `inbox_placement_analytics_list`, `inbox_placement_analytics_insights` |
| Inbox Placement Reports | 2 | `inbox_placement_reports_list`, `inbox_placement_reports_get` |
| CRM Actions | 2 | `crm_actions_list_phone_numbers`, `crm_actions_delete_phone_number` |
| DFY Orders | 7 | `dfy_orders_list`, `dfy_orders_create`, `dfy_orders_cancel` |
| Custom Prompt Templates | 5 | `custom_prompt_templates_list`, `custom_prompt_templates_create` |
| Sales Flow | 5 | `sales_flow_list`, `sales_flow_create`, `sales_flow_delete` |
| Email Templates | 5 | `email_templates_list`, `email_templates_create` |

---

## Example Workflows

### Launch a campaign from scratch

```bash
export INSTANTLY_API_KEY=your-key

# Create the campaign
CAMPAIGN=$(instantly campaigns create --name "Q2 SaaS Outreach" | jq -r '.id')

# Import leads
instantly leads bulk-add --campaign-id "$CAMPAIGN" \
  --leads '[
    {"email":"cto@startup.com","first_name":"Alex","company_name":"Startup Inc"},
    {"email":"vp@growth.co","first_name":"Jordan","company_name":"Growth Co"}
  ]'

# Launch
instantly campaigns activate "$CAMPAIGN"

# Check status
instantly campaigns sending-status "$CAMPAIGN"
```

### Monitor and respond to replies

```bash
# How many unread replies?
instantly email unread-count

# Fetch unread emails for a campaign
instantly email list --campaign-id "$CAMPAIGN" --is-read false

# Reply to a lead
instantly email reply \
  --reply-to-uuid "<email-uuid>" \
  --eaccount "sender@yourdomain.com" \
  --subject "Re: Quick question" \
  --body-text "Thanks for your interest! Let's schedule a call."

# Mark thread as read
instantly email mark-read "<thread-id>"
```

### Health-check your sending infrastructure

```bash
# List all accounts with their status
instantly accounts list

# Run DNS, SMTP, and IMAP diagnostics
instantly accounts test-vitals "<account-id>"

# Enable warmup on cold accounts
instantly accounts warmup-enable --account-ids "id1,id2,id3"

# Check warmup analytics
instantly analytics warmup --emails "sender1@domain.com,sender2@domain.com"
```

### Test deliverability

```bash
# Run an inbox placement test
TEST=$(instantly inbox-placement create \
  --name "March Deliverability Check" \
  --type 0 --sending-method 0 \
  --subject "Test email" \
  --body "Hello from Instantly" \
  --emails "seed@test.com" | jq -r '.id')

# Check results
instantly inbox-placement-analytics insights --test-id "$TEST"
```

### Automate with cron

```bash
# Daily campaign health report (add to crontab)
0 9 * * * INSTANTLY_API_KEY=your-key instantly analytics campaign-overview >> /var/log/instantly-daily.json

# Alert on unread replies
*/5 * * * * INSTANTLY_API_KEY=your-key instantly email unread-count | jq '.count'
```

---

## Architecture

The CLI uses a **CommandDefinition** pattern where every API endpoint is defined as a single object that powers both the CLI subcommand and the MCP tool:

```
src/
├── core/
│   ├── client.ts      # HTTP client with retry, rate limiting, pagination
│   ├── auth.ts        # API key resolution (flag → env → config)
│   ├── output.ts      # JSON output formatting
│   └── types.ts       # CommandDefinition interface
├── commands/
│   ├── campaigns/     # 11 commands
│   ├── leads/         # 12 commands
│   ├── accounts/      # 12 commands
│   └── ...            # 28 more groups
└── mcp/
    └── server.ts      # MCP server (auto-registers all commands as tools)
```

Adding a new API endpoint = creating one file. The command is automatically available in both CLI and MCP.

### HTTP Client Features

- **Auto-retry** with exponential backoff on 429 (rate limit) and 5xx errors
- **Rate limit awareness** — respects `Retry-After` headers
- **Cursor-based pagination** — handles both UUID and datetime cursors
- **30-second timeout** with configurable retries (default: 3)
- **Typed errors** — `AuthError`, `NotFoundError`, `RateLimitError`, `ValidationError`, `ServerError`

---

## Development

```bash
git clone https://github.com/bcharleson/instantly-cli.git
cd instantly-cli
npm install

npm run dev -- campaigns list    # Run in dev mode (tsx)
npm run build                    # Build with tsup
npm test                         # Run tests (138 tests, vitest)
npm run typecheck                # Type-check (tsc --noEmit)
```

### Tech Stack

- **TypeScript** (ESM, Node 20+)
- **Commander.js** — CLI framework
- **Zod** — schema validation (shared between CLI and MCP)
- **@modelcontextprotocol/sdk** — MCP server
- **tsup** — bundler
- **vitest** — test runner

---

## License

MIT
