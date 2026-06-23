module.exports = {
  apps: [
    {
      name: 'bbqdn-backend',
      script: 'src/index.ts',
      cwd: './app/server',
      interpreter: 'bun',
      env_file: '../../.env'
    },
    {
      name: 'bbqdn-frontend',
      script: 'server.js',
      cwd: './app/frontend/.next/standalone/app/frontend',
      interpreter: 'bun',
      // FIX: Added one more level to reliably reach the monorepo root directory
      env_file: '../../../../../../.env'
    }
  ]
};