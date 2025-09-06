#!/bin/bash
set -e

echo "=============================="
echo " SmartFlow AI – Setup Script  "
echo "=============================="

# 1. Install root deps (server + client + tools)
echo "📦 Installing dependencies..."
npm install

# Ensure concurrently is installed
npm install --save-dev concurrently

# 2. Patch backend/server/index.ts to use Replit PORT only
echo "⚡ Patching server/index.ts..."
sed -i 's/const port = parseInt(process.env.PORT || .*/const port = parseInt(process.env.PORT!, 10);/' server/index.ts

# 3. Update root package.json scripts
echo "🛠 Updating package.json scripts..."
jq '.scripts = {
  "dev": "concurrently \\"npm run dev:server\\" \\"npm run dev:client\\"",
  "dev:server": "NODE_ENV=development tsx server/index.ts",
  "dev:client": "vite",
  "build": "npm run build:client && npm run build:server",
  "build:client": "vite build",
  "build:server": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push"
}' package.json > package.tmp.json && mv package.tmp.json package.json

# 4. Configure Vite proxy in frontend (vite.config.ts)
echo "🌐 Setting up Vite proxy..."
cat > vite.config.ts <<'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT || 4000}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
EOF

echo "✅ Setup complete!"
echo "👉 Run your app with: npm run dev"
