const config = require('./config/config');
require('./config/db')(config.settings);
const app = require('./config/setup');
const logger = require('debug')('dev');
let port = config.server.port;
const http = require('http').Server(app);

app.set('config', config.settings);

http.listen(port, () => {
  console.log('#########################################');
  console.log(`Server launched on port: ${port}`);
  console.log('#########################################');
  logger(`server started on port ${port}`);
});
