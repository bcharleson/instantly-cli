import { Command } from 'commander';
import type { CommandDefinition, GlobalOptions } from '../core/types.js';
import { resolveApiKey } from '../core/auth.js';
import { InstantlyClient } from '../core/client.js';
import { output, outputError } from '../core/output.js';

// Auth commands (special — don't need an API client)
import { registerLoginCommand } from './auth/login.js';
import { registerLogoutCommand } from './auth/logout.js';
import { registerOAuthCommand } from './auth/oauth.js';

// Command definitions
import { campaignsListCommand } from './campaigns/list.js';
import { campaignsGetCommand } from './campaigns/get.js';
import { campaignsCreateCommand } from './campaigns/create.js';
import { campaignsUpdateCommand } from './campaigns/update.js';
import { campaignsDeleteCommand } from './campaigns/delete.js';
import { campaignsActivateCommand } from './campaigns/activate.js';
import { campaignsPauseCommand } from './campaigns/pause.js';
import { campaignsDuplicateCommand } from './campaigns/duplicate.js';
import { campaignsSearchByContactCommand } from './campaigns/search-by-contact.js';
import { campaignsCountLaunchedCommand } from './campaigns/count-launched.js';
import { campaignsSendingStatusCommand } from './campaigns/sending-status.js';

import { leadsListCommand } from './leads/list.js';
import { leadsGetCommand } from './leads/get.js';
import { leadsCreateCommand } from './leads/create.js';
import { leadsDeleteCommand } from './leads/delete.js';
import { leadsBulkAddCommand } from './leads/bulk-add.js';
import { leadsBulkDeleteCommand } from './leads/bulk-delete.js';
import { leadsMoveCommand } from './leads/move.js';
import { leadsUpdateCommand } from './leads/update.js';
import { leadsMergeCommand } from './leads/merge.js';
import { leadsUpdateInterestStatusCommand } from './leads/update-interest-status.js';
import { leadsRemoveFromSubsequenceCommand } from './leads/remove-from-subsequence.js';
import { leadsBulkAssignCommand } from './leads/bulk-assign.js';

import { accountsListCommand } from './accounts/list.js';
import { accountsGetCommand } from './accounts/get.js';
import { accountsCreateCommand } from './accounts/create.js';
import { accountsDeleteCommand } from './accounts/delete.js';
import { accountsWarmupEnableCommand } from './accounts/warmup-enable.js';
import { accountsWarmupDisableCommand } from './accounts/warmup-disable.js';
import { accountsTestVitalsCommand } from './accounts/test-vitals.js';
import { accountsUpdateCommand } from './accounts/update.js';
import { accountsPauseCommand } from './accounts/pause.js';
import { accountsResumeCommand } from './accounts/resume.js';
import { accountsMarkFixedCommand } from './accounts/mark-fixed.js';
import { accountsCtdStatusCommand } from './accounts/ctd-status.js';

// Email / Unibox
import { emailListCommand } from './email/list.js';
import { emailGetCommand } from './email/get.js';
import { emailReplyCommand } from './email/reply.js';
import { emailForwardCommand } from './email/forward.js';
import { emailDeleteCommand } from './email/delete.js';
import { emailMarkReadCommand } from './email/mark-read.js';
import { emailUnreadCountCommand } from './email/unread-count.js';
import { emailUpdateCommand } from './email/update.js';

// Analytics
import { analyticsCampaignCommand } from './analytics/campaign.js';
import { analyticsCampaignOverviewCommand } from './analytics/campaign-overview.js';
import { analyticsDailyCampaignCommand } from './analytics/daily-campaign.js';
import { analyticsCampaignStepsCommand } from './analytics/campaign-steps.js';
import { analyticsDailyAccountCommand } from './analytics/daily-account.js';
import { analyticsWarmupCommand } from './analytics/warmup.js';

// Webhooks
import { webhooksListCommand } from './webhooks/list.js';
import { webhooksGetCommand } from './webhooks/get.js';
import { webhooksCreateCommand } from './webhooks/create.js';
import { webhooksDeleteCommand } from './webhooks/delete.js';
import { webhooksTestCommand } from './webhooks/test.js';
import { webhooksEventTypesCommand } from './webhooks/event-types.js';
import { webhooksResumeCommand } from './webhooks/resume.js';
import { webhooksUpdateCommand } from './webhooks/update.js';

// Lead Lists
import { leadListsListCommand } from './lead-lists/list.js';
import { leadListsGetCommand } from './lead-lists/get.js';
import { leadListsCreateCommand } from './lead-lists/create.js';
import { leadListsUpdateCommand } from './lead-lists/update.js';
import { leadListsDeleteCommand } from './lead-lists/delete.js';
import { leadListsVerificationStatsCommand } from './lead-lists/verification-stats.js';

// Enrichment
import { enrichmentEnrichCommand } from './enrichment/enrich.js';
import { enrichmentCountCommand } from './enrichment/count.js';
import { enrichmentGetCommand } from './enrichment/get.js';
import { enrichmentRunCommand } from './enrichment/run.js';
import { enrichmentCreateCommand } from './enrichment/create.js';
import { enrichmentUpdateSettingsCommand } from './enrichment/update-settings.js';
import { enrichmentAiCommand } from './enrichment/ai.js';
import { enrichmentAiProgressCommand } from './enrichment/ai-progress.js';
import { enrichmentHistoryCommand } from './enrichment/history.js';
import { enrichmentPreviewCommand } from './enrichment/preview.js';

// Blocklist
import { blocklistListCommand } from './blocklist/list.js';
import { blocklistCreateCommand } from './blocklist/create.js';
import { blocklistDeleteCommand } from './blocklist/delete.js';
import { blocklistGetCommand } from './blocklist/get.js';
import { blocklistUpdateCommand } from './blocklist/update.js';

// Custom Tags
import { customTagsListCommand } from './custom-tags/list.js';
import { customTagsGetCommand } from './custom-tags/get.js';
import { customTagsCreateCommand } from './custom-tags/create.js';
import { customTagsUpdateCommand } from './custom-tags/update.js';
import { customTagsDeleteCommand } from './custom-tags/delete.js';
import { customTagsToggleCommand } from './custom-tags/toggle.js';

// Lead Labels
import { leadLabelsListCommand } from './lead-labels/list.js';
import { leadLabelsGetCommand } from './lead-labels/get.js';
import { leadLabelsCreateCommand } from './lead-labels/create.js';
import { leadLabelsUpdateCommand } from './lead-labels/update.js';
import { leadLabelsDeleteCommand } from './lead-labels/delete.js';
import { leadLabelsTestAiCommand } from './lead-labels/test-ai.js';

// Workspace
import { workspaceGetCommand } from './workspace/get.js';
import { workspaceUpdateCommand } from './workspace/update.js';
import { workspaceWhitelabelCreateCommand } from './workspace/whitelabel-create.js';
import { workspaceWhitelabelGetCommand } from './workspace/whitelabel-get.js';
import { workspaceWhitelabelDeleteCommand } from './workspace/whitelabel-delete.js';
import { workspaceChangeOwnerCommand } from './workspace/change-owner.js';

// Subsequences
import { subsequencesListCommand } from './subsequences/list.js';
import { subsequencesCreateCommand } from './subsequences/create.js';
import { subsequencesUpdateCommand } from './subsequences/update.js';
import { subsequencesDeleteCommand } from './subsequences/delete.js';
import { subsequencesDuplicateCommand } from './subsequences/duplicate.js';
import { subsequencesPauseCommand } from './subsequences/pause.js';
import { subsequencesResumeCommand } from './subsequences/resume.js';
import { subsequencesSendingStatusCommand } from './subsequences/sending-status.js';

// Background Jobs
import { backgroundJobsListCommand } from './background-jobs/list.js';
import { backgroundJobsGetCommand } from './background-jobs/get.js';

// Email Verification
import { emailVerificationVerifyCommand } from './email-verification/verify.js';
import { emailVerificationStatusCommand } from './email-verification/status.js';

// Account-Campaign Mappings
import { accountMappingsGetCommand } from './account-mappings/get.js';

// Audit Logs
import { auditLogsListCommand } from './audit-logs/list.js';

// Workspace Members
import { workspaceMembersListCommand } from './workspace-members/list.js';
import { workspaceMembersGetCommand } from './workspace-members/get.js';
import { workspaceMembersCreateCommand } from './workspace-members/create.js';
import { workspaceMembersUpdateCommand } from './workspace-members/update.js';
import { workspaceMembersDeleteCommand } from './workspace-members/delete.js';

// API Keys
import { apiKeysCreateCommand } from './api-keys/create.js';
import { apiKeysListCommand } from './api-keys/list.js';
import { apiKeysDeleteCommand } from './api-keys/delete.js';

// Inbox Placement
import { inboxPlacementListCommand } from './inbox-placement/list.js';
import { inboxPlacementGetCommand } from './inbox-placement/get.js';
import { inboxPlacementCreateCommand } from './inbox-placement/create.js';
import { inboxPlacementUpdateCommand } from './inbox-placement/update.js';
import { inboxPlacementDeleteCommand } from './inbox-placement/delete.js';
import { inboxPlacementEspOptionsCommand } from './inbox-placement/esp-options.js';

// Webhook Events
import { webhookEventsListCommand } from './webhook-events/list.js';
import { webhookEventsGetCommand } from './webhook-events/get.js';
import { webhookEventsSummaryCommand } from './webhook-events/summary.js';
import { webhookEventsSummaryByDateCommand } from './webhook-events/summary-by-date.js';

// Workspace Group Members
import { workspaceGroupMembersListCommand } from './workspace-group-members/list.js';
import { workspaceGroupMembersGetCommand } from './workspace-group-members/get.js';
import { workspaceGroupMembersCreateCommand } from './workspace-group-members/create.js';
import { workspaceGroupMembersDeleteCommand } from './workspace-group-members/delete.js';
import { workspaceGroupMembersGetAdminCommand } from './workspace-group-members/get-admin.js';

// Custom Tag Mappings
import { customTagMappingsListCommand } from './custom-tag-mappings/list.js';

// Workspace Billing
import { workspaceBillingPlanDetailsCommand } from './workspace-billing/plan-details.js';
import { workspaceBillingSubscriptionDetailsCommand } from './workspace-billing/subscription-details.js';

// CRM Actions
import { crmActionsListPhoneNumbersCommand } from './crm-actions/list-phone-numbers.js';
import { crmActionsDeletePhoneNumberCommand } from './crm-actions/delete-phone-number.js';

// DFY Orders
import { dfyOrdersCreateCommand } from './dfy-orders/create.js';
import { dfyOrdersListCommand } from './dfy-orders/list.js';
import { dfyOrdersSimilarDomainsCommand } from './dfy-orders/similar-domains.js';
import { dfyOrdersCheckDomainsCommand } from './dfy-orders/check-domains.js';
import { dfyOrdersPreWarmedCommand } from './dfy-orders/pre-warmed.js';
import { dfyOrdersListAccountsCommand } from './dfy-orders/list-accounts.js';
import { dfyOrdersCancelCommand } from './dfy-orders/cancel.js';

// Inbox Placement Analytics
import { inboxPlacementAnalyticsListCommand } from './inbox-placement-analytics/list.js';
import { inboxPlacementAnalyticsGetCommand } from './inbox-placement-analytics/get.js';
import { inboxPlacementAnalyticsStatsByTestCommand } from './inbox-placement-analytics/stats-by-test.js';
import { inboxPlacementAnalyticsStatsByDateCommand } from './inbox-placement-analytics/stats-by-date.js';
import { inboxPlacementAnalyticsInsightsCommand } from './inbox-placement-analytics/insights.js';

// Inbox Placement Reports
import { inboxPlacementReportsListCommand } from './inbox-placement-reports/list.js';
import { inboxPlacementReportsGetCommand } from './inbox-placement-reports/get.js';

// Custom Prompt Templates
import { customPromptTemplatesCreateCommand } from './custom-prompt-templates/create.js';
import { customPromptTemplatesListCommand } from './custom-prompt-templates/list.js';
import { customPromptTemplatesGetCommand } from './custom-prompt-templates/get.js';
import { customPromptTemplatesUpdateCommand } from './custom-prompt-templates/update.js';
import { customPromptTemplatesDeleteCommand } from './custom-prompt-templates/delete.js';

// Sales Flow
import { salesFlowCreateCommand } from './sales-flow/create.js';
import { salesFlowListCommand } from './sales-flow/list.js';
import { salesFlowGetCommand } from './sales-flow/get.js';
import { salesFlowUpdateCommand } from './sales-flow/update.js';
import { salesFlowDeleteCommand } from './sales-flow/delete.js';

// Email Templates
import { emailTemplatesCreateCommand } from './email-templates/create.js';
import { emailTemplatesListCommand } from './email-templates/list.js';
import { emailTemplatesGetCommand } from './email-templates/get.js';
import { emailTemplatesUpdateCommand } from './email-templates/update.js';
import { emailTemplatesDeleteCommand } from './email-templates/delete.js';

// MCP command
import { registerMcpCommand } from './mcp/index.js';

/** All command definitions — the single source of truth for CLI + MCP */
export const allCommands: CommandDefinition[] = [
  // Campaigns
  campaignsListCommand,
  campaignsGetCommand,
  campaignsCreateCommand,
  campaignsUpdateCommand,
  campaignsDeleteCommand,
  campaignsActivateCommand,
  campaignsPauseCommand,
  campaignsDuplicateCommand,
  campaignsSearchByContactCommand,
  campaignsCountLaunchedCommand,
  campaignsSendingStatusCommand,
  // Leads
  leadsListCommand,
  leadsGetCommand,
  leadsCreateCommand,
  leadsDeleteCommand,
  leadsBulkAddCommand,
  leadsBulkDeleteCommand,
  leadsMoveCommand,
  leadsUpdateCommand,
  leadsMergeCommand,
  leadsUpdateInterestStatusCommand,
  leadsRemoveFromSubsequenceCommand,
  leadsBulkAssignCommand,
  // Accounts
  accountsListCommand,
  accountsGetCommand,
  accountsCreateCommand,
  accountsDeleteCommand,
  accountsWarmupEnableCommand,
  accountsWarmupDisableCommand,
  accountsTestVitalsCommand,
  accountsUpdateCommand,
  accountsPauseCommand,
  accountsResumeCommand,
  accountsMarkFixedCommand,
  accountsCtdStatusCommand,
  // Email / Unibox
  emailListCommand,
  emailGetCommand,
  emailReplyCommand,
  emailForwardCommand,
  emailDeleteCommand,
  emailMarkReadCommand,
  emailUnreadCountCommand,
  emailUpdateCommand,
  // Analytics
  analyticsCampaignCommand,
  analyticsCampaignOverviewCommand,
  analyticsDailyCampaignCommand,
  analyticsCampaignStepsCommand,
  analyticsDailyAccountCommand,
  analyticsWarmupCommand,
  // Webhooks
  webhooksListCommand,
  webhooksGetCommand,
  webhooksCreateCommand,
  webhooksDeleteCommand,
  webhooksTestCommand,
  webhooksEventTypesCommand,
  webhooksResumeCommand,
  webhooksUpdateCommand,
  // Lead Lists
  leadListsListCommand,
  leadListsGetCommand,
  leadListsCreateCommand,
  leadListsUpdateCommand,
  leadListsDeleteCommand,
  leadListsVerificationStatsCommand,
  // Enrichment
  enrichmentEnrichCommand,
  enrichmentCountCommand,
  enrichmentGetCommand,
  enrichmentRunCommand,
  enrichmentCreateCommand,
  enrichmentUpdateSettingsCommand,
  enrichmentAiCommand,
  enrichmentAiProgressCommand,
  enrichmentHistoryCommand,
  enrichmentPreviewCommand,
  // Blocklist
  blocklistListCommand,
  blocklistCreateCommand,
  blocklistDeleteCommand,
  blocklistGetCommand,
  blocklistUpdateCommand,
  // Custom Tags
  customTagsListCommand,
  customTagsGetCommand,
  customTagsCreateCommand,
  customTagsUpdateCommand,
  customTagsDeleteCommand,
  customTagsToggleCommand,
  // Lead Labels
  leadLabelsListCommand,
  leadLabelsGetCommand,
  leadLabelsCreateCommand,
  leadLabelsUpdateCommand,
  leadLabelsDeleteCommand,
  leadLabelsTestAiCommand,
  // Workspace
  workspaceGetCommand,
  workspaceUpdateCommand,
  workspaceWhitelabelCreateCommand,
  workspaceWhitelabelGetCommand,
  workspaceWhitelabelDeleteCommand,
  workspaceChangeOwnerCommand,
  // Subsequences
  subsequencesListCommand,
  subsequencesCreateCommand,
  subsequencesUpdateCommand,
  subsequencesDeleteCommand,
  subsequencesDuplicateCommand,
  subsequencesPauseCommand,
  subsequencesResumeCommand,
  subsequencesSendingStatusCommand,
  // Background Jobs
  backgroundJobsListCommand,
  backgroundJobsGetCommand,
  // Email Verification
  emailVerificationVerifyCommand,
  emailVerificationStatusCommand,
  // Account-Campaign Mappings
  accountMappingsGetCommand,
  // Audit Logs
  auditLogsListCommand,
  // Workspace Members
  workspaceMembersListCommand,
  workspaceMembersGetCommand,
  workspaceMembersCreateCommand,
  workspaceMembersUpdateCommand,
  workspaceMembersDeleteCommand,
  // API Keys
  apiKeysCreateCommand,
  apiKeysListCommand,
  apiKeysDeleteCommand,
  // Inbox Placement
  inboxPlacementListCommand,
  inboxPlacementGetCommand,
  inboxPlacementCreateCommand,
  inboxPlacementUpdateCommand,
  inboxPlacementDeleteCommand,
  inboxPlacementEspOptionsCommand,
  // Webhook Events
  webhookEventsListCommand,
  webhookEventsGetCommand,
  webhookEventsSummaryCommand,
  webhookEventsSummaryByDateCommand,
  // Workspace Group Members
  workspaceGroupMembersListCommand,
  workspaceGroupMembersGetCommand,
  workspaceGroupMembersCreateCommand,
  workspaceGroupMembersDeleteCommand,
  workspaceGroupMembersGetAdminCommand,
  // Custom Tag Mappings
  customTagMappingsListCommand,
  // Workspace Billing
  workspaceBillingPlanDetailsCommand,
  workspaceBillingSubscriptionDetailsCommand,
  // CRM Actions
  crmActionsListPhoneNumbersCommand,
  crmActionsDeletePhoneNumberCommand,
  // DFY Orders
  dfyOrdersCreateCommand,
  dfyOrdersListCommand,
  dfyOrdersSimilarDomainsCommand,
  dfyOrdersCheckDomainsCommand,
  dfyOrdersPreWarmedCommand,
  dfyOrdersListAccountsCommand,
  dfyOrdersCancelCommand,
  // Inbox Placement Analytics
  inboxPlacementAnalyticsListCommand,
  inboxPlacementAnalyticsGetCommand,
  inboxPlacementAnalyticsStatsByTestCommand,
  inboxPlacementAnalyticsStatsByDateCommand,
  inboxPlacementAnalyticsInsightsCommand,
  // Inbox Placement Reports
  inboxPlacementReportsListCommand,
  inboxPlacementReportsGetCommand,
  // Custom Prompt Templates
  customPromptTemplatesCreateCommand,
  customPromptTemplatesListCommand,
  customPromptTemplatesGetCommand,
  customPromptTemplatesUpdateCommand,
  customPromptTemplatesDeleteCommand,
  // Sales Flow
  salesFlowCreateCommand,
  salesFlowListCommand,
  salesFlowGetCommand,
  salesFlowUpdateCommand,
  salesFlowDeleteCommand,
  // Email Templates
  emailTemplatesCreateCommand,
  emailTemplatesListCommand,
  emailTemplatesGetCommand,
  emailTemplatesUpdateCommand,
  emailTemplatesDeleteCommand,
];

export function registerAllCommands(program: Command): void {
  // Register auth commands (special handling — no API client needed)
  registerLoginCommand(program);
  registerLogoutCommand(program);
  registerOAuthCommand(program);

  // Register MCP server command
  registerMcpCommand(program);

  // Group commands by their `group` field
  const groups = new Map<string, CommandDefinition[]>();
  for (const cmd of allCommands) {
    if (!groups.has(cmd.group)) groups.set(cmd.group, []);
    groups.get(cmd.group)!.push(cmd);
  }

  for (const [groupName, commands] of groups) {
    const groupCmd = program
      .command(groupName)
      .description(`Manage ${groupName}`);

    for (const cmdDef of commands) {
      registerCommand(groupCmd, cmdDef);
    }
  }
}

function registerCommand(parent: Command, cmdDef: CommandDefinition): void {
  const cmd = parent
    .command(cmdDef.subcommand)
    .description(cmdDef.description);

  // Register positional arguments
  if (cmdDef.cliMappings.args) {
    for (const arg of cmdDef.cliMappings.args) {
      const argStr = arg.required ? `<${arg.name}>` : `[${arg.name}]`;
      cmd.argument(argStr, `${arg.field}`);
    }
  }

  // Register options
  if (cmdDef.cliMappings.options) {
    for (const opt of cmdDef.cliMappings.options) {
      cmd.option(opt.flags, opt.description ?? '');
    }
  }

  // Add examples to help
  if (cmdDef.examples?.length) {
    cmd.addHelpText('after', '\nExamples:\n' + cmdDef.examples.map((e) => `  $ ${e}`).join('\n'));
  }

  cmd.action(async (...actionArgs: any[]) => {
    try {
      // Collect global options from the root program
      const globalOpts = cmd.optsWithGlobals() as GlobalOptions & Record<string, any>;

      // Resolve API key
      const apiKey = await resolveApiKey(globalOpts.apiKey);
      const client = new InstantlyClient({ apiKey });

      // Build input from positional args + options
      const input: Record<string, any> = {};

      // Map positional arguments
      if (cmdDef.cliMappings.args) {
        for (let i = 0; i < cmdDef.cliMappings.args.length; i++) {
          const argDef = cmdDef.cliMappings.args[i];
          if (actionArgs[i] !== undefined) {
            input[argDef.field] = actionArgs[i];
          }
        }
      }

      // Map options
      if (cmdDef.cliMappings.options) {
        for (const opt of cmdDef.cliMappings.options) {
          // Extract the long option name from flags (e.g., "-l, --limit <number>" -> "limit")
          const match = opt.flags.match(/--([a-z-]+)/);
          if (match) {
            const optName = match[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            if (globalOpts[optName] !== undefined) {
              input[opt.field] = globalOpts[optName];
            }
          }
        }
      }

      // Validate input against schema
      const parsed = cmdDef.inputSchema.safeParse(input);
      if (!parsed.success) {
        const issues = parsed.error.issues ?? [];
        const missing = issues
          .filter((i: any) => i.code === 'invalid_type' && String(i.message).includes('received undefined'))
          .map((i: any) => '--' + String(i.path?.[0] ?? '').replace(/_/g, '-'));
        if (missing.length > 0) {
          throw new Error(`Missing required option(s): ${missing.join(', ')}`);
        }
        const msg = issues.map((i: any) => `${i.path?.join('.')}: ${i.message}`).join('; ');
        throw new Error(`Invalid input: ${msg}`);
      }

      const result = await cmdDef.handler(parsed.data, client);
      output(result, globalOpts);
    } catch (error) {
      const globalOpts = cmd.optsWithGlobals() as GlobalOptions;
      outputError(error, globalOpts);
    }
  });
}
