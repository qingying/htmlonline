'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _colour = require('colour');

var _colour2 = _interopRequireDefault(_colour);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_colour2.default.setTheme({
	error: 'red',
	info: 'green'
});

exports.default = _colour2.default;