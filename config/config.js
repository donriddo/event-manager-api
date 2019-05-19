// config/config.js

let settings;

if (process.env.NODE_ENV === 'production') {
  // required environment variables
  ([
    'DB_URI',
    'JWT_SECRET'
  ]).forEach((name) => {
    if (!process.env[name]) {
      throw new Error(`Environment variable ${name} is missing`)
    }
  })
  settings = require('./env/production');
} else {
  try {
    settings = require('./env/development');
  } catch (error) {
    console.log(error.message);
    console.log('Using development.default.js as the default config file');
    settings = require('./env/development.default');
  }
}

module.exports = {
  env: process.env.NODE_ENV,
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    enabled: process.env.BOOLEAN ? process.env.BOOLEAN.toLowerCase() === 'true' : false
  },
  server: {
    port: Number(process.env.PORT) || 37000
  },
  settings: settings
  // ...
}
