# Instantly.ai — MCP Context

## What is Instantly?

[Instantly.ai](https://instantly.ai) is a cold email automation platform for sales teams and growth marketers. It handles sending infrastructure, inbox warm-up, lead management, analytics, and unibox (unified inbox) for replies.

## Authentication

All tools require an `INSTANTLY_API_KEY` environment variable. Users can generate API keys from their Instantly workspace settings.

## Tool Categories (156 tools total)

### Campaigns (11 tools)
Create and manage outbound email campaigns:
- `campaigns_list`, `campaigns_get`, `campaigns_create`, `campaigns_update`, `campaigns_delete`
- `campaigns_activate` — start sending
- `campaigns_pause` — pause sending
- `campaigns_duplicate` — clone a campaign
- `campaigns_search_by_contact` — find campaigns containing a specific lead
- `campaigns_count_launched` — count active campaigns
- `campaigns_sending_status` — diagnose sending issues

### Leads (12 tools)
Manage prospects inside campaigns:
- `leads_list`, `leads_get`, `leads_create`, `leads_update`, `leads_delete`
- `leads_bulk_add` — add up to 1,000 leads at once
- `leads_bulk_delete` — delete leads in bulk
- `leads_bulk_assign` — assign leads to sending accounts
- `leads_move` — move leads between campaigns
- `leads_merge` — merge duplicate leads
- `leads_update_interest_status` — set interest level
- `leads_remove_from_subsequence` — remove from a subsequence

### Email Accounts (12 tools)
Manage sending email addresses (SMTP/IMAP or Google/Outlook OAuth):
- `accounts_list`, `accounts_get`, `accounts_create`, `accounts_update`, `accounts_delete`
- `accounts_warmup_enable`, `accounts_warmup_disable`
- `accounts_test_vitals` — run DNS/SMTP/IMAP health checks
- `accounts_pause`, `accounts_resume`, `accounts_mark_fixed`
- `accounts_ctd_status` — check click-to-deliver status

### Email / Unibox (8 tools)
Read and reply to emails in the unified inbox:
- `email_list`, `email_get`, `email_update`, `email_delete`
- `email_reply` — send a reply to a specific email thread
- `email_forward` — forward an email to another address
- `email_mark_read` — mark an email thread as read
- `email_unread_count` — count unread emails

### Analytics (6 tools)
Measure campaign performance:
- `analytics_campaign` — per-campaign stats (sent, opens, clicks, replies, bounces)
- `analytics_campaign_overview` — aggregated stats across all campaigns
- `analytics_daily_campaign` — day-by-day breakdown for a campaign
- `analytics_campaign_steps` — per-step breakdown in a sequence
- `analytics_daily_account` — daily sending volume per account
- `analytics_warmup` — warmup performance stats for accounts

### Webhooks (8 tools)
Subscribe to real-time events:
- `webhooks_list`, `webhooks_get`, `webhooks_create`, `webhooks_update`, `webhooks_delete`
- `webhooks_test` — fire a test payload to verify your endpoint
- `webhooks_event_types` — list all available event type names
- `webhooks_resume` — re-enable a suspended webhook

### Webhook Events (4 tools)
Inspect webhook delivery history:
- `webhook_events_list`, `webhook_events_get`
- `webhook_events_summary`, `webhook_events_summary_by_date`

### Lead Lists (6 tools)
Manage reusable lead lists (CSV imports, enrichment targets):
- `lead_lists_list`, `lead_lists_get`, `lead_lists_create`, `lead_lists_update`, `lead_lists_delete`
- `lead_lists_verification_stats` — show email verification status breakdown

### Enrichment (10 tools)
Enrich lead data with company/contact intelligence:
- `enrichment_enrich`, `enrichment_count`, `enrichment_get`, `enrichment_run`
- `enrichment_create`, `enrichment_update_settings`
- `enrichment_ai` — AI-powered enrichment
- `enrichment_ai_progress` — check AI enrichment status
- `enrichment_history` — view enrichment history
- `enrichment_preview` — preview matching leads

### Blocklist (5 tools)
Prevent sending to specific domains or emails:
- `blocklist_list`, `blocklist_get`, `blocklist_create`, `blocklist_update`, `blocklist_delete`

### Custom Tags (6 tools)
Organize campaigns and leads with custom tags:
- `custom_tags_list`, `custom_tags_get`, `custom_tags_create`, `custom_tags_update`, `custom_tags_delete`, `custom_tags_toggle`

### Custom Tag Mappings (1 tool)
- `custom_tag_mappings_list` — list tag-to-resource mappings

### Lead Labels (6 tools)
AI-powered labeling system to categorize reply intent:
- `lead_labels_list`, `lead_labels_get`, `lead_labels_create`, `lead_labels_update`, `lead_labels_delete`
- `lead_labels_test_ai` — test the AI label classifier against a sample reply

### Workspace (6 tools)
- `workspace_get`, `workspace_update`
- `workspace_whitelabel_create`, `workspace_whitelabel_get`, `workspace_whitelabel_delete`
- `workspace_change_owner` — transfer workspace ownership

### Workspace Members (5 tools)
Manage team access:
- `workspace_members_list`, `workspace_members_get`, `workspace_members_create`, `workspace_members_update`, `workspace_members_delete`

### Workspace Group Members (5 tools)
Manage group membership:
- `workspace_group_members_list`, `workspace_group_members_get`, `workspace_group_members_create`, `workspace_group_members_delete`
- `workspace_group_members_get_admin`

### Workspace Billing (2 tools)
- `workspace_billing_plan_details`, `workspace_billing_subscription_details`

### Subsequences (8 tools)
Multi-branch sequences that trigger based on lead behavior:
- `subsequences_list`, `subsequences_create`, `subsequences_update`, `subsequences_delete`
- `subsequences_duplicate`, `subsequences_pause`, `subsequences_resume`
- `subsequences_sending_status` — check whether subsequence is actively sending

### Background Jobs (2 tools)
- `background_jobs_list` — list async bulk operations and their status
- `background_jobs_get` — get job details

### Email Verification (2 tools)
- `email_verification_verify` — verify a single email address
- `email_verification_status` — get the result of a previous verification

### Account-Campaign Mappings (1 tool)
- `account_mappings_get` — see which sending accounts are assigned to a campaign

### Audit Logs (1 tool)
- `audit_logs_list` — retrieve workspace activity log for compliance/debugging

### API Keys (3 tools)
- `api_keys_list`, `api_keys_create`, `api_keys_delete`

### Inbox Placement (6 tools)
Test where emails land (inbox, spam, promotions):
- `inbox_placement_list`, `inbox_placement_get`, `inbox_placement_create`, `inbox_placement_update`, `inbox_placement_delete`
- `inbox_placement_esp_options` — list ESP options

### Inbox Placement Analytics (5 tools)
- `inbox_placement_analytics_list`, `inbox_placement_analytics_get`
- `inbox_placement_analytics_stats_by_test`, `inbox_placement_analytics_stats_by_date`
- `inbox_placement_analytics_insights` — deliverability insights

### Inbox Placement Reports (2 tools)
- `inbox_placement_reports_list`, `inbox_placement_reports_get`

### CRM Actions (2 tools)
- `crm_actions_list_phone_numbers`, `crm_actions_delete_phone_number`

### DFY Orders (7 tools)
Manage Done-For-You email account orders:
- `dfy_orders_list`, `dfy_orders_create`, `dfy_orders_cancel`
- `dfy_orders_similar_domains`, `dfy_orders_check_domains`, `dfy_orders_pre_warmed`
- `dfy_orders_list_accounts`

### Custom Prompt Templates (5 tools)
- `custom_prompt_templates_list`, `custom_prompt_templates_get`, `custom_prompt_templates_create`, `custom_prompt_templates_update`, `custom_prompt_templates_delete`

### Sales Flow (5 tools)
- `sales_flow_list`, `sales_flow_get`, `sales_flow_create`, `sales_flow_update`, `sales_flow_delete`

### Email Templates (5 tools)
- `email_templates_list`, `email_templates_get`, `email_templates_create`, `email_templates_update`, `email_templates_delete`

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
