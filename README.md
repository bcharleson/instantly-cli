# Instantly CLI

Cold email automation in your terminal. **156 API commands** across **31 entity groups** — full access to the [Instantly.ai](https://instantly.ai) API V2, for humans and AI agents.

## Install

```bash
npm install -g instantly-cli
```

Or use without installing:

```bash
npx instantly-cli campaigns list
```

Or one-liner:

```bash
curl -fsSL https://releases.instantly.dev/install.sh | bash
```

## Quick Start

```bash
# 1. Authenticate
instantly login

# 2. List your campaigns
instantly campaigns list

# 3. Create a lead
instantly leads create --email "john@acme.com" --campaign-id <id>

# 4. Check account health
instantly accounts test-vitals <account-id>

# 5. Connect a Google account via OAuth
instantly oauth connect google
```

## Commands

### Campaigns (11)

```bash
instantly campaigns list                    # List all campaigns
instantly campaigns get <id>                # Get campaign details
instantly campaigns create --name "Q1"      # Create campaign
instantly campaigns update <id> --name "Q2" # Update campaign
instantly campaigns activate <id>           # Start sending
instantly campaigns pause <id>              # Pause campaign
instantly campaigns duplicate <id>          # Duplicate campaign
instantly campaigns search-by-contact --email "a@b.com"  # Find campaigns by contact
instantly campaigns count-launched          # Count launched campaigns
instantly campaigns sending-status <id>     # Get sending status
instantly campaigns delete <id>             # Delete campaign
```

### Leads (12)

```bash
instantly leads list --campaign-id <id>     # List leads in campaign
instantly leads get <id>                    # Get lead details
instantly leads create --email "a@b.com" --campaign-id <id>
instantly leads update <id> --first-name "Jane"
instantly leads bulk-add --campaign-id <id> --leads '[{"email":"a@b.com"}]'
instantly leads bulk-delete --campaign-id <id> --delete-all
instantly leads bulk-assign --lead-ids "id1,id2" --account-id <id>
instantly leads move --lead-ids "id1,id2" --to-campaign-id <id>
instantly leads merge --lead-ids "id1,id2"
instantly leads update-interest-status --lead-id <id> --interest-status 1
instantly leads remove-from-subsequence --lead-id <id> --subsequence-id <id>
instantly leads delete <id>                 # Delete lead
```

### Email Accounts (12)

```bash
instantly accounts list                     # List all accounts
instantly accounts get <id>                 # Get account details
instantly accounts create --email "..." --smtp-host "..." ...
instantly accounts update <email> --daily-limit 50
instantly accounts warmup-enable --account-ids "id1,id2"
instantly accounts warmup-disable --account-ids "id1,id2"
instantly accounts test-vitals <id>         # Test DNS/SMTP/IMAP
instantly accounts pause <email>            # Pause account
instantly accounts resume <email>           # Resume account
instantly accounts mark-fixed <email>       # Mark account as fixed
instantly accounts ctd-status               # Check CTD status
instantly accounts delete <id>              # Delete account
```

### Email / Unibox (8)

```bash
instantly email list                        # List emails
instantly email list --campaign-id <id> --is-read false
instantly email get <id>                    # Get email details
instantly email reply --reply-to-uuid <id> --eaccount "user@domain.com" --subject "Re: Hello" --body-text "Thanks!"
instantly email forward --forward-uuid <id> --eaccount "user@domain.com" --to "other@domain.com" --subject "Fwd: Hello"
instantly email update <id> --is-read true  # Update email
instantly email delete <id>                 # Delete email
instantly email mark-read <thread-id>       # Mark thread as read
instantly email unread-count                # Count unread emails
```

### Analytics (6)

```bash
instantly analytics campaign                # All campaign analytics
instantly analytics campaign --id <id>      # Single campaign analytics
instantly analytics campaign-overview       # Aggregated overview
instantly analytics daily-campaign --campaign-id <id>  # Daily breakdown
instantly analytics campaign-steps --campaign-id <id>  # Per-step analytics
instantly analytics daily-account           # Daily account sending stats
instantly analytics warmup --emails "user1@domain.com,user2@domain.com"
```

### Webhooks (8)

```bash
instantly webhooks list                     # List webhooks
instantly webhooks get <id>                 # Get webhook details
instantly webhooks create --url "https://example.com/hook" --event-type lead_interested
instantly webhooks update <id> --url "https://example.com/hook2"
instantly webhooks test <id>                # Send test payload
instantly webhooks event-types              # List available event types
instantly webhooks resume <id>              # Resume disabled webhook
instantly webhooks delete <id>              # Delete webhook
```

### Webhook Events (4)

```bash
instantly webhook-events list               # List webhook events
instantly webhook-events get <id>           # Get event details
instantly webhook-events summary            # Event summary
instantly webhook-events summary-by-date    # Event summary by date
```

### Lead Lists (6)

```bash
instantly lead-lists list                   # List all lead lists
instantly lead-lists get <id>               # Get lead list details
instantly lead-lists create --name "Q1 Prospects"
instantly lead-lists update <id> --name "Q2 Prospects"
instantly lead-lists verification-stats <id> # Email verification stats
instantly lead-lists delete <id>            # Delete lead list
```

### Enrichment / SuperSearch (10)

```bash
instantly enrichment enrich --search-filters '{"job_titles":["CTO"]}' --limit 100
instantly enrichment count --search-filters '{"industries":["SaaS"]}'
instantly enrichment get <resource-id>      # Get enrichment settings
instantly enrichment run --resource-id <id> # Run enrichment
instantly enrichment create --name "Q1" --search-filters '{}' --enrichment-settings '{}'
instantly enrichment update-settings <resource-id> --enrichment-settings '{}'
instantly enrichment ai --resource-id <id> --prompt "Find CTOs"
instantly enrichment ai-progress <resource-id>  # Check AI enrichment progress
instantly enrichment history <resource-id>      # Get enrichment history
instantly enrichment preview --search-filters '{}'  # Preview lead results
```

### Blocklist (5)

```bash
instantly blocklist list                    # List blocked emails/domains
instantly blocklist get <id>                # Get blocklist entry
instantly blocklist create --value "spam@domain.com"
instantly blocklist update <id> --value "newspam@domain.com"
instantly blocklist delete <id>             # Remove blocklist entry
```

### Custom Tags (6)

```bash
instantly custom-tags list                  # List tags
instantly custom-tags get <id>              # Get tag details
instantly custom-tags create --label "High Priority"
instantly custom-tags update <id> --label "Updated"
instantly custom-tags toggle --tag-ids "t1" --resource-ids "r1" --resource-type 1 --assign
instantly custom-tags delete <id>           # Delete tag
```

### Custom Tag Mappings (1)

```bash
instantly custom-tag-mappings list          # List tag-to-resource mappings
```

### Lead Labels (6)

```bash
instantly lead-labels list                  # List labels
instantly lead-labels get <id>              # Get label details
instantly lead-labels create --label "Hot Lead" --interest-status "positive"
instantly lead-labels update <id> --label "Warm Lead"
instantly lead-labels test-ai --reply-text "Yes, I'm interested"  # Test AI classification
instantly lead-labels delete <id>           # Delete label
```

### Workspace (6)

```bash
instantly workspace get                     # Get workspace info
instantly workspace update --name "My Workspace"
instantly workspace whitelabel-create --domain "mail.example.com"
instantly workspace whitelabel-get          # Get whitelabel domain
instantly workspace whitelabel-delete       # Remove whitelabel domain
instantly workspace change-owner --email "newowner@co.com"
```

### Workspace Members (5)

```bash
instantly workspace-members list                        # List members
instantly workspace-members get <id>                    # Get member details
instantly workspace-members create --email "user@co.com" --role admin
instantly workspace-members update <id> --role member   # Update role
instantly workspace-members delete <id>                 # Remove member
```

### Workspace Group Members (5)

```bash
instantly workspace-group-members list                  # List group members
instantly workspace-group-members get <id>              # Get group member
instantly workspace-group-members create --user-id <id> --group-id <id>
instantly workspace-group-members get-admin              # Get admin details
instantly workspace-group-members delete <id>           # Remove group member
```

### Workspace Billing (2)

```bash
instantly workspace-billing plan-details               # Get plan details
instantly workspace-billing subscription-details       # Get subscription info
```

### Subsequences (8)

```bash
instantly subsequences list --campaign-id <id>          # List subsequences
instantly subsequences create --campaign-id <id> --name "Follow-up" --conditions '{}' --schedule '{}' --sequences '[]'
instantly subsequences update <id> --name "New Name"    # Update subsequence
instantly subsequences duplicate <id> --campaign-id <target-id> --name "Copy"
instantly subsequences pause <id>                       # Pause subsequence
instantly subsequences resume <id>                      # Resume subsequence
instantly subsequences sending-status <id>              # Get sending status
instantly subsequences delete <id>                      # Delete subsequence
```

### Background Jobs (2)

```bash
instantly background-jobs list                          # List background jobs
instantly background-jobs list --status completed --type import
instantly background-jobs get <id>                      # Get job details
```

### Email Verification (2)

```bash
instantly email-verification verify --email "john@example.com"
instantly email-verification status <email>             # Check verification status
```

### Account-Campaign Mappings (1)

```bash
instantly account-mappings get <email>                  # Get campaigns for account
```

### Audit Logs (1)

```bash
instantly audit-logs list                               # List audit log records
instantly audit-logs list --start-date 2025-01-01 --end-date 2025-03-01
```

### API Keys (3)

```bash
instantly api-keys create --name "CI/CD Key" --scopes "campaigns:read,leads:read"
instantly api-keys list                                 # List API keys
instantly api-keys delete <id>                          # Delete API key
```

### Inbox Placement (6)

```bash
instantly inbox-placement list                          # List placement tests
instantly inbox-placement get <id>                      # Get test details
instantly inbox-placement create --name "Q1 Test" --type 0 --sending-method 0 --subject "Test" --body "Hello" --emails "seed1@test.com"
instantly inbox-placement update <id> --name "Updated"  # Update test
instantly inbox-placement esp-options                   # List ESP options
instantly inbox-placement delete <id>                   # Delete test
```

### Inbox Placement Analytics (5)

```bash
instantly inbox-placement-analytics list                # List analytics
instantly inbox-placement-analytics get <id>            # Get analytics details
instantly inbox-placement-analytics stats-by-test --test-ids "id1,id2"
instantly inbox-placement-analytics stats-by-date --test-id <id>
instantly inbox-placement-analytics insights --test-id <id>
```

### Inbox Placement Reports (2)

```bash
instantly inbox-placement-reports list                  # List reports
instantly inbox-placement-reports get <id>              # Get report details
```

### CRM Actions (2)

```bash
instantly crm-actions list-phone-numbers               # List phone numbers
instantly crm-actions delete-phone-number <id>         # Delete phone number
```

### DFY Orders (7)

```bash
instantly dfy-orders list                              # List DFY orders
instantly dfy-orders create --items '[...]'            # Create order
instantly dfy-orders similar-domains --domain "example.com"
instantly dfy-orders check-domains --domains "a.com,b.com"
instantly dfy-orders pre-warmed                        # List pre-warmed domains
instantly dfy-orders list-accounts                     # List DFY accounts
instantly dfy-orders cancel --account-ids "id1,id2"    # Cancel accounts
```

### Custom Prompt Templates (5)

```bash
instantly custom-prompt-templates list                 # List templates
instantly custom-prompt-templates get <id>             # Get template
instantly custom-prompt-templates create --name "Opener" --prompt "Write an opener..."
instantly custom-prompt-templates update <id> --name "Updated"
instantly custom-prompt-templates delete <id>          # Delete template
```

### Sales Flow (5)

```bash
instantly sales-flow list                              # List sales flows
instantly sales-flow get <id>                          # Get flow details
instantly sales-flow create --name "Inbound Flow"
instantly sales-flow update <id> --name "Updated"
instantly sales-flow delete <id>                       # Delete flow
```

### Email Templates (5)

```bash
instantly email-templates list                         # List templates
instantly email-templates get <id>                     # Get template
instantly email-templates create --name "Welcome" --subject "Hello" --body "..."
instantly email-templates update <id> --name "Updated"
instantly email-templates delete <id>                  # Delete template
```

### OAuth (connect email accounts)

```bash
instantly oauth connect google              # Connect Google account
instantly oauth connect microsoft           # Connect Microsoft account
instantly oauth status <session-id>         # Check OAuth session status
```

## Authentication

Three ways to authenticate, in priority order:

1. **Flag**: `--api-key <key>` on any command
2. **Environment variable**: `export INSTANTLY_API_KEY=your-key`
3. **Stored config**: `instantly login` saves to `~/.instantly/config.json`

Get your API key: [app.instantly.ai/app/settings/integrations](https://app.instantly.ai/app/settings/integrations)

### For AI Agents

Set the environment variable — no interactive prompts needed:

```bash
export INSTANTLY_API_KEY=your-key
instantly campaigns list
```

## Output Formats

```bash
# Default: raw JSON (machine-parseable)
instantly campaigns list

# Pretty-printed JSON
instantly campaigns list --pretty

# Select specific fields
instantly campaigns list --fields "id,name,status"

# Suppress output (exit code only)
instantly campaigns list --quiet
```

## MCP Server

The CLI doubles as an [MCP](https://modelcontextprotocol.io/) server, giving AI assistants (Claude, Cursor, VS Code) direct access to all **156 Instantly tools**.

```bash
instantly mcp
```

### Configuration

Add to your MCP config (Claude Desktop, Cursor, VS Code, Windsurf):

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

This registers **156 tools** across 31 groups:

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

## For AI Agents & Automation

This CLI is designed to be used by AI agents (OpenClaw, Claude, custom agents) for cold outbound automation:

- **156 API commands** — full Instantly V2 API coverage
- **JSON output by default** — pipe to `jq`, parse in scripts
- **Environment variable auth** — no interactive prompts needed
- **MCP server mode** — native AI assistant integration with 156 tools
- **OAuth account connection** — connect Google/Microsoft accounts from CLI
- **Scriptable** — works in CI/CD, cron jobs, shell scripts
- **Zero-config** — `npx instantly-cli campaigns list` works immediately

```bash
# Example: Agent workflow
export INSTANTLY_API_KEY=your-key

# Create a campaign
CAMPAIGN_ID=$(instantly campaigns create --name "AI Outreach" | jq -r '.id')

# Add leads
instantly leads bulk-add --campaign-id "$CAMPAIGN_ID" \
  --leads '[{"email":"cto@startup.com","first_name":"Alex"}]'

# Activate
instantly campaigns activate "$CAMPAIGN_ID"

# Monitor analytics
instantly analytics campaign --id "$CAMPAIGN_ID"

# Check replies
instantly email list --campaign-id "$CAMPAIGN_ID" --is-read false
```

## Development

```bash
git clone https://github.com/ApolloIO/instantly-cli.git
cd instantly-cli
npm install
npm run dev -- campaigns list    # Run in dev mode
npm run build                     # Build
npm test                          # Run tests (138 tests)
npm run typecheck                 # Type-check
```

## License

MIT
