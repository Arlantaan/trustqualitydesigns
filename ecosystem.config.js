module.exports = {
  apps: [
    {
      // Application name
      name: 'tqd-app',
      
      // Command to start
      script: 'node_modules/.bin/next',
      args: 'start',
      
      // Cluster mode - use all CPU cores
      instances: 'max',
      exec_mode: 'cluster',

      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Memory limits
      max_memory_restart: '500M',
      
      // Graceful restart
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 3000,

      // Logging
      error_file: '/var/log/pm2/tqd-app-error.log',
      out_file: '/var/log/pm2/tqd-app-out.log',
      log_file: '/var/log/pm2/tqd-app.log',
      time: true,

      // Auto restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',

      // Watch for file changes (only in development)
      // watch: ['src', 'public'],
      // ignore_watch: ['node_modules', '.next', 'logs'],

      // Health check
      health_check: {
        protocol: 'http',
        port: 3000,
        endpoint: '/health',
        timeout: 3000,
      },

      // Stopping strategy
      stop_on_failure: true,
      
      // Additional environment
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      }
    }
  ],

  // Deploy config (optional)
  deploy: {
    production: {
      user: 'root',
      host: '194.163.135.177',
      ref: 'origin/main',
      repo: 'https://github.com/arlantaan/trustqualitydesigns.git',
      path: '/var/www/tqd',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
