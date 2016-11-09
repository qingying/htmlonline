'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('./color');

var ProcessNode = function () {
	function ProcessNode(config) {
		_classCallCheck(this, ProcessNode);

		this.node = config.node;
		// this.type = config.type;
		this.transformConfig = config.transformConfig;
		this.waitDownload = config.waitDownload;
		this.srcFilter = this.getSrcFilter();
		this.processNode();
	}

	_createClass(ProcessNode, [{
		key: 'processNode',
		value: function processNode() {
			if (this.filterNode('removeTag') != undefined) {
				// 移除标签
				return this.removeFun();
			}
			if (this.filterNode('inlineTag') != undefined) {
				// 内联文件
				return this.inlineFun();
			}
			var relativeValue = this.filterNode('relativeTag');
			if (relativeValue != undefined) {
				// 替换相对路径
				return this.relativeFun(relativeValue);
			}
			var replaceValue = this.filterNode('replaceTag');
			if (replaceValue != undefined) {
				// 替换成配置链接
				this.replaceFun(replaceValue);
			}
			var absoluteValue = this.filterNode('absoluteTag');
			if (absoluteValue != undefined) {
				// 替换成线上链接
				this.absoluteFun(absoluteValue);
			}
		}
	}, {
		key: 'filterNode',
		value: function filterNode(filter) {
			var value = this.node.attr(this.transformConfig[filter]);
			this.node.removeAttr(this.transformConfig[filter]);
			return value;
		}
	}, {
		key: 'getFilePath',
		value: function getFilePath(src) {
			var sourceSrc = '';
			var partten = src.match(/(build|dest|dist|deploy)\/(.*)/);
			if (partten) {
				sourceSrc = partten[2];
			}
			return sourceSrc;
		}
	}, {
		key: 'getFileName',
		value: function getFileName(sourceSrc) {
			var namePartten = sourceSrc.match(/([^\.]*)\.[.]*/);
			var name = namePartten && namePartten[1];
			name = name || '';
			return name;
		}
	}, {
		key: 'getSrcFilter',
		value: function getSrcFilter() {
			var srcFilter = void 0;
			var type = this.node[0].tagName;
			if (type == 'link') {
				srcFilter = 'href';
			} else {
				srcFilter = 'src';
			}
			return srcFilter;
		}
	}, {
		key: 'removeFun',
		value: function removeFun() {
			this.node.remove();
		}
	}, {
		key: 'inlineFun',
		value: function inlineFun() {
			this.waitDownload.push(this.node);
		}
	}, {
		key: 'relativeFun',
		value: function relativeFun(relativeValue) {
			var newSrc = void 0;
			var src = void 0;
			var srcFilter = this.srcFilter;
			src = this.node.attr(srcFilter);
			var sourceSrc = this.getFilePath(src);
			newSrc = './' + sourceSrc;
			if (relativeValue != 'true') {
				var name = this.getFileName(sourceSrc);
				if (name) {
					newSrc = './' + relativeValue.replace(/{name}/, name);
				}
			}
			this.node.attr(srcFilter, newSrc);
		}
	}, {
		key: 'replaceFun',
		value: function replaceFun(replaceValue) {

			if (replaceValue == 'remove') {
				this.removeFun();
			} else {
				this.node.attr(this.srcFilter, replaceValue);
			}
		}
	}, {
		key: 'absoluteFun',
		value: function absoluteFun(absoluteValue) {
			// console.log(process);
			var srcFilter = this.srcFilter;
			var src = this.node.attr(srcFilter);
			var sourceSrc = this.getFilePath(src);
			var fileName = this.getFileName(sourceSrc);

			var version = this.transformConfig.version;
			var appname = this.transformConfig.appname;
			var aliEnv = this.transformConfig.ali;
			if (!version) {
				console.log('没有获取到版本号，请检查分支'.error);
				return;
			}
			var newSrc = void 0;
			if (aliEnv) {
				absoluteValue = absoluteValue || sourceSrc;
				if (aliEnv == 'dev') {
					newSrc = '//g.assets.daily.taobao.net/mtb/' + appname + '/' + version + '/' + absoluteValue;
				} else {
					newSrc = '//g.alicdn.com/mtb/' + appname + '/' + version + '/' + absoluteValue;
				}
				newSrc = newSrc.replace(/{name}/, fileName);
			} else {
				newSrc = absoluteValue.replace(/{appname}/, appname).replace(/{version}/, version).replace(/{name}/, fileName);
			}
			this.node.attr(srcFilter, newSrc);
		}
	}]);

	return ProcessNode;
}();

exports.default = ProcessNode;