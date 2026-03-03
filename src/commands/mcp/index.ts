import { Command } from 'commander';
import { startMcpServer } from '../../mcp/server.js';

export function registerMcpCommand(program: Command): void {
  program
    .command('mcp')
    .description('Start the MCP server for AI assistant integration (Claude, Cursor, VS Code, Windsurf)')
    .addHelpText('after', `
MCP Configuration:

  For Claude Desktop / Cursor / VS Code, add to your MCP config:

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

  Or if installed globally:

  {
    "mcpServers": {
      "instantly": {
        "command": "instantly",
        "args": ["mcp"],
        "env": {
          "INSTANTLY_API_KEY": "your-api-key"
        }
      }
    }
  }`)
    .action(async () => {
      process.on('SIGINT', () => process.exit(0));
      process.on('SIGTERM', () => process.exit(0));

      try {
        await startMcpServer();
      } catch (error: any) {
        console.error('Failed to start MCP server:', error.message ?? error);
        process.exit(1);
      }
    });
}
