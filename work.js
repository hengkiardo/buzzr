#!/usr/bin/env node

'use strict';

var express = require('express'),
    args = process.argv.slice(2);

require('dotenv').load();


var env = args[0] || 'development',
    config = require('./server/config/config')[env],
    app = express();

// setup datastore
require('./server/config/mongoose.js')(config);

// setup express
require('./server/config/express.js')(app, config);

// setup worker
require('./worker/')(app);
