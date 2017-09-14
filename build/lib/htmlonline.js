'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _file = require('./file.js');

var _file2 = _interopRequireDefault(_file);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var argv = require('yargs').argv;
var path = require('path');
var fs = require('fs');
var Request = require('request');
var cur_path = process.cwd();

var Htmlonline = function () {
	function Htmlonline(config) {
		_classCallCheck(this, Htmlonline);

		this.src = config.src;
		this.out = config.out;
		this.transformConfig = config.transformConfig;
		if (!this.src || !this.out) {
			console.log('文件路径没传'.error);
		} else {
			this.getCompletePath();
			this.processFile();
		}
	}

	_createClass(Htmlonline, [{
		key: 'getCompletePath',
		value: function getCompletePath() {
			this.src = path.join(cur_path, this.src);
			this.out = path.join(cur_path, this.out);
		}
	}, {
		key: 'processFile',
		value: function processFile() {
			var src = this.src;
			var self = this;
			fs.stat(src, function (err, stats) {
				if (err) {
					console.log(err);
					console.log(src + ' get fail'.error);
					throw new Error('fail');
					return;
				}
				if (stats.isFile(src)) {
					// 文件
					var fileName = path.basename(src);
					var filePath = path.dirname(src);
					self.newFile(filePath, fileName);
				} else {
					// 路径
					fs.readdir(src, function (err, files) {
						files.forEach(function (fileName) {
							self.newFile(src, fileName);
						});
					});
				}
			});
		}
	}, {
		key: 'newFile',
		value: function newFile(filePath, fileName) {
			var self = this;
			new _file2.default({
				filePath: filePath,
				fileName: fileName,
				outDir: self.out,
				transformConfig: self.transformConfig
			});
		}
	}]);

	return Htmlonline;
}();

exports.default = Htmlonline;