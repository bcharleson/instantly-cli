import { describe, it, expect } from 'vitest';
import { analyticsCampaignCommand } from '../../src/commands/analytics/campaign.js';
import { analyticsCampaignOverviewCommand } from '../../src/commands/analytics/campaign-overview.js';
import { analyticsDailyCampaignCommand } from '../../src/commands/analytics/daily-campaign.js';
import { analyticsCampaignStepsCommand } from '../../src/commands/analytics/campaign-steps.js';
import { analyticsDailyAccountCommand } from '../../src/commands/analytics/daily-account.js';
import { analyticsWarmupCommand } from '../../src/commands/analytics/warmup.js';

describe('Analytics CommandDefinitions', () => {
  it('analytics_campaign has correct structure', () => {
    expect(analyticsCampaignCommand.name).toBe('analytics_campaign');
    expect(analyticsCampaignCommand.group).toBe('analytics');
    expect(analyticsCampaignCommand.endpoint.method).toBe('GET');
    expect(analyticsCampaignCommand.endpoint.path).toBe('/campaigns/analytics');
  });

  it('analytics_campaign accepts optional filters', () => {
    const result = analyticsCampaignCommand.inputSchema.safeParse({});
    expect(result.success).toBe(true);

    const withDates = analyticsCampaignCommand.inputSchema.safeParse({
      start_date: '2025-01-01',
      end_date: '2025-03-01',
    });
    expect(withDates.success).toBe(true);
  });

  it('analytics_campaign_overview queries overview endpoint', () => {
    expect(analyticsCampaignOverviewCommand.endpoint.path).toBe('/campaigns/analytics/overview');
    expect(analyticsCampaignOverviewCommand.endpoint.method).toBe('GET');
  });

  it('analytics_daily_campaign queries daily analytics', () => {
    expect(analyticsDailyCampaignCommand.endpoint.path).toBe('/campaigns/analytics/daily');
    expect(analyticsDailyCampaignCommand.endpoint.method).toBe('GET');
  });

  it('analytics_campaign_steps queries step-level analytics', () => {
    expect(analyticsCampaignStepsCommand.endpoint.path).toBe('/campaigns/analytics/steps');
    expect(analyticsCampaignStepsCommand.endpoint.method).toBe('GET');
  });

  it('analytics_daily_account queries account daily analytics', () => {
    expect(analyticsDailyAccountCommand.endpoint.path).toBe('/accounts/analytics/daily');
    expect(analyticsDailyAccountCommand.endpoint.method).toBe('GET');
  });

  it('analytics_warmup uses POST method', () => {
    expect(analyticsWarmupCommand.endpoint.method).toBe('POST');
    expect(analyticsWarmupCommand.endpoint.path).toBe('/accounts/warmup-analytics');
  });

  it('all analytics commands have descriptions', () => {
    const commands = [
      analyticsCampaignCommand, analyticsCampaignOverviewCommand,
      analyticsDailyCampaignCommand, analyticsCampaignStepsCommand,
      analyticsDailyAccountCommand, analyticsWarmupCommand,
    ];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });
});
