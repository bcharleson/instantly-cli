# AI Agent Guide — Instantly CLI

> This file helps AI agents (GPT, Claude, Gemini, open-source models, etc.) install, authenticate, and use the Instantly CLI to manage cold email campaigns, leads, email accounts, and more via the Instantly.ai platform.

## Quick Start

```bash
# Install globally
npm install -g instantly-cli

# Authenticate (non-interactive — best for agents)
export INSTANTLY_API_KEY="your-api-key-here"

# Verify it works
instantly campaigns list
```

**Requirements:** Node.js 18+

## Authentication

Set your API key via environment variable — no interactive login needed:

```bash
export INSTANTLY_API_KEY="your-api-key-here"
```

Or pass it per-command:

```bash
instantly campaigns list --api-key "your-api-key-here"
```

API keys are generated from: https://app.instantly.ai/app/settings/integrations

## Output Format

All commands output **JSON to stdout** by default — ready for parsing:

```bash
# Default: compact JSON
instantly campaigns list
# → [{"id":"abc-123","name":"Q1 Outreach","status":"active",...}]

# Pretty-printed JSON
instantly campaigns list --output pretty

# Select specific fields
instantly campaigns list --fields id,name,status

# Suppress output (exit code only)
instantly campaigns list --quiet
```

**Exit codes:** 0 = success, 1 = error. Errors go to stderr as JSON:
```json
{"error":"Missing required option(s): --host","code":"UNKNOWN_ERROR"}
```

## Discovering Commands

```bash
# List all command groups
instantly --help

# List subcommands in a group
instantly campaigns --help

# Get help for a specific subcommand (shows required options + examples)
instantly leads bulk-add --help
```

If you use a wrong subcommand, the CLI tells you what's available:
```
error: unknown command 'get' for 'workspace-billing'
Available commands: plan-details, subscription-details
```

## All Command Groups & Subcommands

### campaigns
Manage outbound email campaigns.
```
list              List campaigns (paginated)
get               Get a campaign by ID
create            Create a new campaign
update            Update a campaign
delete            Delete a campaign
activate          Start sending a campaign
pause             Pause a campaign
duplicate         Clone a campaign
search-by-contact Find campaigns containing a specific lead email
count-launched    Count active/launched campaigns
sending-status    Diagnose sending issues for a campaign
```

### leads
Manage prospects inside campaigns.
```
list                     List leads (paginated)
get                      Get a lead by email
create                   Create a single lead
update                   Update a lead
delete                   Delete a lead
bulk-add                 Add up to 1,000 leads at once
bulk-delete              Delete leads in bulk
bulk-assign              Assign leads to sending accounts
move                     Move leads between campaigns
merge                    Merge duplicate leads
update-interest-status   Set lead interest level
remove-from-subsequence  Remove lead from a subsequence
```

### accounts
Manage sending email accounts.
```
list             List email accounts
get              Get account by email address
create           Create a new email account
update           Update an email account
delete           Delete an email account
warmup-enable    Enable warmup for an account
warmup-disable   Disable warmup for an account
test-vitals      Run DNS/SMTP/IMAP health checks
pause            Pause an account
resume           Resume a paused account
mark-fixed       Mark a flagged account as fixed
ctd-status       Check custom tracking domain status (requires --host)
```

### email
Read and reply to emails in the unified inbox.
```
list          List emails (paginated)
get           Get a specific email
update        Update email metadata
delete        Delete an email
reply         Reply to an email thread
forward       Forward an email
mark-read     Mark an email thread as read
unread-count  Count unread emails
```

### analytics
Measure campaign and account performance.
```
campaign           Per-campaign stats (sent, opens, clicks, replies, bounces)
campaign-overview  Aggregated stats across all campaigns
daily-campaign     Day-by-day breakdown for a campaign
campaign-steps     Per-step breakdown in a sequence
daily-account      Daily sending volume per account
warmup             Warmup performance stats (requires --emails)
```

### webhooks
Subscribe to real-time events.
```
list         List webhooks
get          Get a webhook by ID
create       Create a webhook
update       Update a webhook
delete       Delete a webhook
test         Fire a test payload
event-types  List available event type names
resume       Re-enable a suspended webhook
```

### lead-lists
Manage reusable lead lists.
```
list                List lead lists
get                 Get a lead list by ID
create              Create a lead list
update              Update a lead list
delete              Delete a lead list
verification-stats  Email verification status breakdown
```

### enrichment
Enrich lead data with company/contact intelligence.
```
enrich           Enrich leads
count            Count enrichable leads
get              Get enrichment by ID
run              Run enrichment
create           Create enrichment config
update-settings  Update enrichment settings
ai               AI-powered enrichment
ai-progress      Check AI enrichment progress
history          View enrichment history
preview          Preview matching leads
```

### blocklist
Prevent sending to specific domains or emails.
```
list    List blocklist entries
get     Get a blocklist entry
create  Add to blocklist
update  Update a blocklist entry
delete  Remove from blocklist
```

### custom-tags
Organize campaigns and leads with tags.
```
list    List tags
get     Get a tag by ID
create  Create a tag
update  Update a tag
delete  Delete a tag
toggle  Toggle a tag on/off for a resource
```

### lead-labels
AI-powered labeling for reply intent.
```
list     List labels
get      Get a label by ID
create   Create a label
update   Update a label
delete   Delete a label
test-ai  Test AI classifier against a sample reply
```

### workspace
```
get               Get workspace info
update            Update workspace settings
whitelabel-create Create a whitelabel domain
whitelabel-get    Get whitelabel domain info
whitelabel-delete Delete whitelabel domain
change-owner      Transfer workspace ownership
```

### subsequences
Multi-branch sequences triggered by lead behavior.
```
list            List subsequences
create          Create a subsequence
update          Update a subsequence
delete          Delete a subsequence
duplicate       Clone a subsequence
pause           Pause a subsequence
resume          Resume a subsequence
sending-status  Check if subsequence is actively sending
```

### background-jobs
```
list  List async bulk operations and their status
get   Get job details by ID
```

### email-verification
```
verify  Verify a single email address
status  Get result of a previous verification
```

### account-mappings
```
get  See which sending accounts are assigned to a campaign
```

### audit-logs
```
list  Retrieve workspace activity log
```

### workspace-members
```
list    List workspace members
get     Get a member by ID
create  Invite a member
update  Update member permissions
delete  Remove a member
```

### api-keys
```
list    List API keys
create  Create an API key
delete  Delete an API key
```

### inbox-placement
Test where emails land (inbox, spam, promotions).
```
list         List placement tests
get          Get a test by ID
create       Create a placement test
update       Update a test
delete       Delete a test
esp-options  List ESP options
```

### webhook-events
Inspect webhook delivery history.
```
list             List webhook events
get              Get a webhook event by ID
summary          Event summary
summary-by-date  Event summary by date
```

### workspace-group-members
```
list       List group members
get        Get a group member
create     Add a group member
delete     Remove a group member
get-admin  Get group admin
```

### custom-tag-mappings
```
list  List tag-to-resource mappings
```

### workspace-billing
```
plan-details          Get workspace plan details
subscription-details  Get subscription details
```

### crm-actions
```
list-phone-numbers    List phone numbers
delete-phone-number   Delete a phone number
```

### dfy-orders
Manage Done-For-You email account orders.
```
create           Create a DFY order
list             List DFY orders
similar-domains  Find similar domains
check-domains    Check domain availability
pre-warmed       List pre-warmed accounts
list-accounts    List accounts from orders
cancel           Cancel an order
```

### inbox-placement-analytics
```
list           List analytics
get            Get analytics by ID
stats-by-test  Stats grouped by test
stats-by-date  Stats grouped by date
insights       Deliverability insights
```

### inbox-placement-reports
```
list  List reports (requires --test-id)
get   Get a report by ID
```

### custom-prompt-templates
```
list    List prompt templates
get     Get a template by ID
create  Create a template
update  Update a template
delete  Delete a template
```

### sales-flow
```
list    List sales flows
get     Get a flow by ID
create  Create a flow
update  Update a flow
delete  Delete a flow
```

### email-templates
```
list    List email templates
get     Get a template by ID
create  Create a template
update  Update a template
delete  Delete a template
```

## Common Workflows

### Launch a new campaign
```bash
# 1. Create the campaign
instantly campaigns create --name "Q1 Outreach" --schedule '{"timezone":"America/New_York"}'

# 2. Add leads to it
instantly leads bulk-add --campaign-id "<campaign-id>" --leads '[{"email":"lead@example.com","first_name":"Jane"}]'

# 3. Start sending
instantly campaigns activate --id "<campaign-id>"
```

### Monitor reply volume
```bash
# Check unread count
instantly email unread-count

# Fetch unread emails
instantly email list --is-read false

# Reply to a thread
instantly email reply --unibox-email-id "<email-id>" --message "Thanks for your interest!"
```

### Health-check sending infrastructure
```bash
# List all accounts
instantly accounts list

# Test a specific account
instantly accounts test-vitals --email "sender@domain.com"

# Enable warmup on a cold account
instantly accounts warmup-enable --email "sender@domain.com"
```

### Check campaign performance
```bash
# High-level overview
instantly analytics campaign-overview

# Per-campaign breakdown
instantly analytics campaign --campaign-id "<id>"

# Day-by-day trends
instantly analytics daily-campaign --campaign-id "<id>"
```

### Manage webhooks
```bash
# See available event types
instantly webhooks event-types

# Create a webhook
instantly webhooks create --event-type "email_sent" --webhook-url "https://your-endpoint.com/hook"

# Test it
instantly webhooks test --id "<webhook-id>"
```

### Listen for replies and events

The CLI manages webhooks but doesn't run an HTTP listener. Here are two approaches depending on your capabilities:

**Approach 1: Polling (recommended for most agents)**

No server required — just poll on an interval:

```bash
# Check for unread replies every 60 seconds
instantly email unread-count
# → {"count":3}

# If count > 0, fetch the new emails
instantly email list --is-read false --limit 20

# Process each reply, then mark as read
instantly email mark-read <thread-id>

# Or check lead interest status changes
instantly leads list --campaign-id "<id>" --interest-status "positive" --limit 50
```

**Approach 2: Webhooks (real-time, requires a listener endpoint)**

If you can receive HTTP POST requests (e.g., you have a server, tunnel, or serverless function):

```bash
# Step 1: See all available event types
instantly webhooks event-types
# Common events: reply_received, email_sent, lead_interested,
#   email_opened, link_clicked, email_bounced, email_unsubscribed

# Step 2: Register a webhook for replies
instantly webhooks create \
  --event-type "reply_received" \
  --webhook-url "https://your-agent-endpoint.com/instantly-hook"

# Step 3: Verify it works
instantly webhooks test --id "<webhook-id>"

# Step 4: Check delivery history if events seem missing
instantly webhook-events list --webhook-id "<webhook-id>"
instantly webhook-events summary --webhook-id "<webhook-id>"
```

When Instantly sends a POST to your endpoint, the payload includes the event type and relevant data (lead email, campaign ID, thread ID, etc.). Your agent can then react by running more CLI commands.

**Approach 3: Polling webhook event history (hybrid)**

If you registered webhooks elsewhere but want to audit delivery:

```bash
# Check what events were fired recently
instantly webhook-events list --webhook-id "<id>" --limit 20

# Get summary counts by event type
instantly webhook-events summary --webhook-id "<id>"

# Daily breakdown
instantly webhook-events summary-by-date --webhook-id "<id>"
```

## Pagination

List commands support cursor-based pagination:

```bash
# First page
instantly campaigns list --limit 10

# Next page (use the last item's ID as cursor)
instantly campaigns list --limit 10 --starting-after "<last-id>"
```

## MCP Server (for Claude, Cursor, VS Code)

The CLI also includes a built-in MCP server exposing all 156 commands as tools:

```bash
# Start the MCP server
instantly mcp
```

MCP config for your AI assistant:
```json
{
  "mcpServers": {
    "instantly": {
      "command": "npx",
      "args": ["instantly-cli", "mcp"],
      "env": { "INSTANTLY_API_KEY": "your-key" }
    }
  }
}
```

## Email Body Formatting

Instantly renders email bodies as HTML. Plain text with `\n` newlines will render as a single unbroken block in recipients' email clients.

**The CLI auto-converts plain text to HTML** in `email reply`, `email forward`, and `leads bulk-add` (for custom_variables with `body` in the key name). But if you're building bodies yourself, follow these rules:

- Each paragraph → `<div>paragraph text</div>`
- Blank line → `<div><br /></div>`
- Never use raw `\n` newlines in email body strings
- Template variables `{{first_name}}` and spin syntax `{{RANDOM|a|b}}` pass through untouched

```bash
# The CLI auto-converts this plain text in --body-text:
instantly email reply --reply-to-uuid <id> --eaccount "me@domain.com" \
  --subject "Re: Hello" --body-text "Hi Sarah,

Worth it?

Mark"
# → Automatically generates HTML: <div>Hi Sarah,</div><div><br /></div><div>Worth it?</div>...

# For leads bulk-add, plain text in body custom_variables is auto-converted:
instantly leads bulk-add --campaign-id <id> --leads '[{
  "email": "lead@example.com",
  "custom_variables": {
    "email_1_body": "Hi {{first_name}},\n\nWorth a quick chat?\n\nMark"
  }
}]'
# → email_1_body auto-converted to HTML for proper rendering
```

## Tips for AI Agents

1. **Always use `--help`** on a group before guessing subcommand names
2. **Parse JSON output** directly — it's the default format
3. **Check exit codes** — 0 means success, 1 means error
4. **Required options** are enforced with clear error messages before API calls
5. **Rate limits** are handled automatically (100 req/10s, 600 req/min) with retry
6. **Use `--fields`** to reduce output size when you only need specific data
7. **Use `--quiet`** when you only care about success/failure
8. **Use `--pretty`** for human-readable JSON (shorthand for `--output pretty`)
