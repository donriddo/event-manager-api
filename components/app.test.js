const config = require('../config/config');
require('../config/db')(
    Object.assign(
        config.settings,
        { DB_URI: 'mongodb://localhost/event_manager_test' }
    )
);
const app = require('../config/setup');

app.set('config', config.settings);

describe('App', function () {
    after(function (done) {
        if (mongoose.connection.db.databaseName === 'event_manager_test') {
            console.log('Dropping Test Database...')
            mongoose.connection.db.dropDatabase(done);
        }
    });
});

module.exports = app;
