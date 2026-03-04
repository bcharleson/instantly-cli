#!/bin/bash
set -euo pipefail

# Instantly CLI installer
# Usage: curl -fsSL https://raw.githubusercontent.com/bcharleson/instantly-cli/main/install.sh | bash

PACKAGE="instantly-cli"

echo ""
echo "  ⚡ Installing Instantly CLI..."
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "  Node.js is required but not installed."
  echo ""
  echo "  Install Node.js 18+ from: https://nodejs.org"
  echo "  Or via nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash"
  echo ""
  exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "  Node.js 18+ is required. Current version: $(node -v)"
  echo "  Please upgrade: https://nodejs.org"
  exit 1
fi

# Install globally via npm
if command -v npm &> /dev/null; then
  npm install -g "$PACKAGE"
else
  echo "  npm not found. Please install Node.js 18+ from https://nodejs.org"
  exit 1
fi

echo ""
echo "  ✓ Instantly CLI installed successfully!"
echo ""
echo "  Get started:"
echo "    instantly login          # Authenticate with your API key"
echo "    instantly campaigns list # List your campaigns"
echo "    instantly --help         # See all commands"
echo ""
echo "  For AI assistant integration:"
echo "    instantly mcp            # Start MCP server"
echo ""
