module.exports = {
  apps: [{
    "name": "koa",
    //"interpreter": "./node_modules/.bin/ts-node",
    //"interpreter_args": "-T -r tsconfig-paths/register ./src/app.ts",
    "cwd": "./dist",
    "script": "./app.js",
    "exec_mode": "cluster",
    "instances": 1,
    "cron_restart": "0 03 * * *",
    "autorestart": true,
    "watch": false,
    "min_uptime": "200s",
    "max_restarts": 10,
    "ignore_watch": [
        "node_modules",
        ".vscode",
        "log",
        ".git"
    ],
    "max_memory_restart": "100M",
    "restart_delay": "3000",
    "env": {
        "NODE_ENV": "development"
    },
    "env_production": {
      "NODE_ENV": "production"
    },
    "error_file": "./log/app-err.log",
    "out_file": "./log/app-out.log",
    "merge_logs": true,
    "log_date_format": "YYYY-MM-DD HH:mm:ss"
  }]
};