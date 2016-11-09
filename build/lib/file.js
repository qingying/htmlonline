'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _ProcessNode = require('./ProcessNode');

var _ProcessNode2 = _interopRequireDefault(_ProcessNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('./color');
require("babel-polyfill");

var File = function () {
	function File(config) {
		var _this = this;

		_classCallCheck(this, File);

		this.transformConfig = config.transformConfig;
		this.filePath = config.filePath;
		this.outDir = config.outDir;
		this.fileName = config.fileName;
		this.version = config.version;
		this.waitDownload = [];
		this.fileContent = '';
		this.outHtml = '';
		this.$ = null;
		this.readFile().then(function () {
			return _this.processDoc();
		}).then(function () {
			return _this.downloadFiles();
		}).then(function () {
			return _this.writeFile();
		}).catch(function (e) {
			if (e) {
				console.log(e);
			}
		});
	}

	_createClass(File, [{
		key: 'readFile',
		value: function readFile() {
			var _this2 = this;

			var self = this;
			return new Promise(function (resolve, reject) {
				var filePath = _this2.filePath;
				var fileName = _this2.fileName;
				var readFilePath = _path2.default.join(filePath, fileName);
				_fs2.default.readFile(readFilePath, 'utf8', function (err, file) {
					if (!file) {
						console.log(readFilePath + ' get fail'.error);
						reject && reject();
						return;
					}
					self.fileContent = file;
					console.log('read file success');
					resolve && resolve();
				});
			});
		}
	}, {
		key: 'writeFile',
		value: function writeFile() {
			this.outHtml = this.$.html();
			console.log('write file');
			if (!_fs2.default.existsSync(this.outDir)) {
				_fs2.default.mkdirSync(this.outDir);
			}
			var outPath = _path2.default.join(this.outDir, this.fileName);
			_fs2.default.writeFile(outPath, this.outHtml, function (err) {
				if (err) {
					console.log(outPath + '写入失败'.error);
				} else {
					console.log(outPath + '创建成功'.info);
				}
			});
		}
	}, {
		key: 'processDoc',
		value: function processDoc() {
			console.log('processDoc');
			var $ = _cheerio2.default.load(this.fileContent, {
				decodeEntities: false,
				normalizeWhitespace: false
			});
			this.$ = $;
			this.processNodeList('link');
			this.processNodeList('script');
			this.processNodeList('*[remove=true]');
		}
	}, {
		key: 'processNodeList',
		value: function processNodeList(filter) {
			var _this3 = this;

			var nodeList = this.$(filter);
			nodeList && nodeList.map(function (item) {
				_this3.processNode(nodeList[item], filter);
			});
		}
	}, {
		key: 'processNode',
		value: function processNode(node, type) {
			var self = this;
			new _ProcessNode2.default({
				node: self.$(node),
				// type: type,
				transformConfig: self.transformConfig,
				waitDownload: self.waitDownload,
				version: self.version
			});
		}
	}, {
		key: 'downloadFiles',
		value: function downloadFiles() {
			var _this4 = this;

			var PromiseList = this.waitDownload.map(function (item) {
				return _this4.downloadItem(item);
			});
			return Promise.all(PromiseList);
		}
	}, {
		key: 'downloadItem',
		value: function downloadItem(node) {
			var _this5 = this;

			var self = this;
			return new Promise(function (resolve, reject) {
				var link = node.attr('src') || node.attr('link');
				if (!link) {
					resolve && resolve();
				}
				if (/\/\//.test(link)) {
					// 线上链接
					if (!/http/.test(link)) {
						link = 'http:' + link;
					}
					(0, _request2.default)(link, function (error, response, file) {
						if (!error && response && response.statusCode == 200) {
							self.replaceNode(node, file);
							resolve && resolve();
						} else {
							console.log(link + '下载失败，请检查网络后重试'.error);
							reject && reject();
						}
					});
				} else {
					(function () {
						// 本地文件
						var linkPath = _path2.default.join(_this5.filePath, link);
						var self = _this5;
						_fs2.default.readFile(linkPath, function (err, file) {
							if (err) {
								reject && reject();
							} else {
								self.replaceNode(node, file);
								resolve && resolve();
							}
						});
					})();
				}
			});
		}
	}, {
		key: 'replaceNode',
		value: function replaceNode(node, content) {
			node.removeAttr('src');
			node.removeAttr('script');
			node.text(content);
		}
	}]);

	return File;
}();

exports.default = File;