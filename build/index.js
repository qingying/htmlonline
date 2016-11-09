#!/usr/bin/env node
'use strict';

var _config = require('./lib/config');

var _config2 = _interopRequireDefault(_config);

var _htmlonline = require('./lib/htmlonline');

var _htmlonline2 = _interopRequireDefault(_htmlonline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./lib/tip');


new _htmlonline2.default(_config2.default);