const express = require('express');
const app = express();
const routes = require('../components');
const bodyParser = require('body-parser');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const cors = require('cors');

const logDirectory = path.join(__dirname, 'logs');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})

// Enable CORS
app.use(cors());

// setup the logger
app.use(logger('combined', {stream: accessLogStream}))
// const logger = require('debug')('queencake-api:app');
//
// app.use(logger('dev', {
// 	stream: fs.createWriteStream('access.log', {'flags': 'a'})
// }));

app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((req, res, next) => res.status(404).json({ message: 'URL Not Found' }));

module.exports = app;
