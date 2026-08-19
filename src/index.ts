import { Command } from 'commander';
import { registerAllCommands } from './commands/index.js';

// __CLI_VERSION__ is replaced by tsup at build time (see tsup.config.ts `define`).
// This avoids runtime createRequire() calls whose relative paths break after bundling.
declare const __CLI_VERSION__: string;
const version = __CLI_VERSION__;

const program = new Command();

program
  .name('instantly')
  .description('CLI and MCP server for the Instantly.ai cold email platform')
  .version(version)
  .option('--api-key <key>', 'API key (overrides INSTANTLY_API_KEY env var and stored config)')
  .option('--profile <slug>', 'Use a named workspace profile from ~/.instantly/profiles/<slug>.json (or set INSTANTLY_PROFILE)')
  .option('--workspace <uuid>', 'Confirm the target workspace UUID (required for write commands when using a profile)')
  .option('--output <format>', 'Output format: json (default) or pretty', 'json')
  .option('--pretty', 'Shorthand for --output pretty')
  .option('--quiet', 'Suppress output, exit codes only')
  .option('--fields <fields>', 'Comma-separated list of fields to include in output');

registerAllCommands(program);

program.parse();
