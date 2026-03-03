# Instantly.ai — MCP Context

## What is Instantly?

[Instantly.ai](https://instantly.ai) is a cold email automation platform for sales teams and growth marketers. It handles sending infrastructure, inbox warm-up, lead management, analytics, and unibox (unified inbox) for replies.

## Authentication

All tools require an `INSTANTLY_API_KEY` environment variable. Users can generate API keys from their Instantly workspace settings.

## Tool Categories (92 tools total)

### Campaigns (7 tools)
Create and manage outbound email campaigns. Key operations:
- `campaigns_list` — list all campaigns with pagination
- `campaigns_get` — get full details of a campaign by ID
- `campaigns_create` — create a new campaign (requires a name)
- `campaigns_update` — update campaign name, schedule, or settings
- `campaigns_activate` — start sending a paused/draft campaign
- `campaigns_pause` — pause an active campaign
- `campaigns_delete` — permanently delete a campaign

### Leads (7 tools)
Manage prospects inside campaigns:
- `leads_list` — list leads in a campaign (filter by status, search by email)
- `leads_get` — get a single lead by ID
- `leads_create` — add a single lead to a campaign
- `leads_bulk_add` — add multiple leads at once (up to 1,000 per call)
- `leads_move` — move leads from one campaign to another
- `leads_delete` — delete a single lead
- `leads_bulk_delete` — delete all or filtered leads in a campaign

### Email Accounts (7 tools)
Manage sending email addresses (SMTP/IMAP or Google/Outlook OAuth):
- `accounts_list` — list all connected sending accounts
- `accounts_get` — get details of a single account
- `accounts_create` — connect a new SMTP/IMAP account
- `accounts_warmup_enable` — enable warmup on one or more accounts
- `accounts_warmup_disable` — disable warmup on one or more accounts
- `accounts_test_vitals` — run DNS/SMTP/IMAP health checks
- `accounts_delete` — disconnect and remove an account

### Email / Unibox (7 tools)
Read and reply to emails in the unified inbox:
- `email_list` — list emails (filter by campaign, read status, account, date)
- `email_get` — get a single email by ID
- `email_reply` — send a reply to a specific email thread
- `email_forward` — forward an email to another address
- `email_delete` — delete an email
- `email_mark_read` — mark an email thread as read
- `email_unread_count` — count unread emails (optionally filtered by campaign)

### Analytics (6 tools)
Measure campaign performance:
- `analytics_campaign` — per-campaign stats (sent, opens, clicks, replies, bounces)
- `analytics_campaign_overview` — aggregated stats across all campaigns
- `analytics_daily_campaign` — day-by-day breakdown for a campaign
- `analytics_campaign_steps` — per-step breakdown in a sequence
- `analytics_daily_account` — daily sending volume per account
- `analytics_warmup` — warmup performance stats for accounts

### Webhooks (7 tools)
Subscribe to real-time events:
- `webhooks_list`, `webhooks_get`, `webhooks_create`, `webhooks_delete`
- `webhooks_test` — fire a test payload to verify your endpoint
- `webhooks_event_types` — list all available event type names
- `webhooks_resume` — re-enable a suspended webhook

### Lead Lists (6 tools)
Manage reusable lead lists (CSV imports, enrichment targets):
- `lead_lists_list`, `lead_lists_get`, `lead_lists_create`, `lead_lists_update`, `lead_lists_delete`
- `lead_lists_verification_stats` — show email verification status breakdown

### Enrichment (4 tools)
Enrich lead data with company/contact intelligence:
- `enrichment_enrich` — enrich a single lead (returns company, title, LinkedIn, etc.)
- `enrichment_count` — count enrichable leads in a list
- `enrichment_get` — get enrichment result for a lead
- `enrichment_run` — trigger bulk enrichment for a lead list

### Blocklist (3 tools)
Prevent sending to specific domains or emails:
- `blocklist_list`, `blocklist_create`, `blocklist_delete`

### Custom Tags (6 tools)
Organize campaigns and leads with custom tags:
- `custom_tags_list`, `custom_tags_get`, `custom_tags_create`, `custom_tags_update`, `custom_tags_delete`, `custom_tags_toggle`

### Lead Labels (6 tools)
AI-powered labeling system to categorize reply intent:
- `lead_labels_list`, `lead_labels_get`, `lead_labels_create`, `lead_labels_update`, `lead_labels_delete`
- `lead_labels_test_ai` — test the AI label classifier against a sample reply

### Workspace (2 tools)
- `workspace_get` — get workspace settings and subscription info
- `workspace_update` — update workspace name or timezone

### Subsequences (8 tools)
Multi-branch sequences that trigger based on lead behavior:
- `subsequences_list`, `subsequences_create`, `subsequences_update`, `subsequences_delete`
- `subsequences_duplicate`, `subsequences_pause`, `subsequences_resume`
- `subsequences_sending_status` — check whether subsequence is actively sending

### Background Jobs (1 tool)
- `background_jobs_list` — list async bulk operations and their status

### Email Verification (2 tools)
- `email_verification_verify` — verify a single email address
- `email_verification_status` — get the result of a previous verification

### Account-Campaign Mappings (1 tool)
- `account_mappings_get` — see which sending accounts are assigned to a campaign

### Audit Logs (1 tool)
- `audit_logs_list` — retrieve workspace activity log for compliance/debugging

### Workspace Members (5 tools)
Manage team access:
- `workspace_members_list`, `workspace_members_get`, `workspace_members_create`, `workspace_members_update`, `workspace_members_delete`

### API Keys (1 tool)
- `api_keys_create` — generate a new API key for a workspace

### Inbox Placement (5 tools)
Test where emails land (inbox, spam, promotions):
- `inbox_placement_list`, `inbox_placement_get`, `inbox_placement_create`, `inbox_placement_update`, `inbox_placement_delete`

## Common Workflows

**Launch a new campaign:**
1. `campaigns_create` — create the campaign
2. `leads_bulk_add` — add leads to it
3. `campaigns_activate` — start sending

**Monitor reply volume:**
1. `email_unread_count` — get unread count
2. `email_list` with `is_read: false` — fetch unread emails
3. `email_reply` — respond to a lead

**Health check sending infrastructure:**
1. `accounts_list` — see all accounts
2. `accounts_test_vitals` — run DNS/SMTP/IMAP checks on flagged accounts
3. `accounts_warmup_enable` — enable warmup on cold accounts

**Analyze campaign performance:**
1. `analytics_campaign_overview` — high-level numbers
2. `analytics_campaign` — per-campaign breakdown
3. `analytics_daily_campaign` — identify day-over-day trends

## Key Identifiers

- Most resources use UUID strings as IDs (e.g., campaign IDs, lead IDs, account IDs)
- Email accounts are also identified by their email address string in some contexts
- Pagination uses `skip` (offset) and `limit` parameters
