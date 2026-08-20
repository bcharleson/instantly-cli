import { Command } from 'commander';
import { registerAllCommands } from './commands/index.js';

// __CLI_VERSION__ is replaced by tsup at build time (see tsup.config.ts `define`).
declare const __CLI_VERSION__: string;
const version = typeof __CLI_VERSION__ !== 'undefined' ? __CLI_VERSION__ : '0.0.0-dev';

/**
 * Build the public CLI. Tests import this instead of src/index.ts so they
 * exercise the same global flags and command registration as production.
 */
export function createProgram(): Command {
  const program = new Command();

  program
    .name('instantly')
    .description(
      'CLI and MCP server for the Instantly.ai cold email platform. ' +
        'Default: one workspace via login/config. Agency: --profile <slug> selects one named workspace; ' +
        'writes also require --workspace <uuid>. One process, one workspace.',
    )
    .version(version)
    .option('--api-key <key>', 'API key (overrides INSTANTLY_API_KEY env var and stored config)')
    .option('--profile <slug>', 'Use a named workspace profile from ~/.instantly/profiles/<slug>.json (or set INSTANTLY_PROFILE)')
    .option(
      '--workspace <uuid>',
      'Confirm the target workspace UUID. Required for writes when using a profile. When passed on any path, must match the live workspace.',
    )
    .option('--output <format>', 'Output format: json (default) or pretty', 'json')
    .option('--pretty', 'Shorthand for --output pretty')
    .option('--quiet', 'Suppress output, exit codes only')
    .option('--fields <fields>', 'Comma-separated list of fields to include in output');

  registerAllCommands(program);
  return program;
}
