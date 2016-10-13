require('./color');
export default class ProcessNode {
	constructor(config) {
		this.node = config.node;
		// this.type = config.type;
		this.transformConfig = config.transformConfig;
		this.waitDownload = config.waitDownload;
		this.srcFilter = this.getSrcFilter();
		this.processNode();
	}
	processNode() {
		if (this.filterNode('removeTag') != undefined ) {
			// 移除标签
			return this.removeFun();
		}
		if (this.filterNode('inlineTag') != undefined) {
			// 内联文件
			return this.inlineFun();
		}
		let relativeValue = this.filterNode('relativeTag');
		if (relativeValue != undefined ) {
			// 替换相对路径
			return this.relativeFun(relativeValue);
		}
		let replaceValue = this.filterNode('replaceTag')
		if (replaceValue != undefined ) {
			// 替换成配置链接
			this.replaceFun(replaceValue);
		}
		let absoluteValue = this.filterNode('absoluteTag')
		if (absoluteValue != undefined ) {
			// 替换成线上链接
			this.absoluteFun(absoluteValue);
		}
	}
	filterNode(filter) {
		let value = this.node.attr(this.transformConfig[filter]);
		this.node.removeAttr(this.transformConfig[filter]);
		return value;
	}
	getFilePath(src) {
		let sourceSrc = '';
		let partten = src.match(/(build|dest|dist)\/(.*)/);
		if (partten) {
			sourceSrc = partten[2];
		}
		return sourceSrc;
	}
	getFileName(sourceSrc) {
		let namePartten = sourceSrc.match(/([^\.]*)\.[.]*/);
		let name = namePartten && namePartten[1];
		name = name || '';
		return name;
	}
	getSrcFilter() {
		let srcFilter;
		let type = this.node[0].tagName;
		if (type == 'link') {
			srcFilter = 'href';
		} else {
			srcFilter = 'src';
		}
		return srcFilter;
	}
	removeFun() {
		this.node.remove();
	}
	inlineFun() {
		this.waitDownload.push(this.node);
	}
	relativeFun(relativeValue) {
		let newSrc;
		let src;
		let srcFilter = this.srcFilter;
		src = this.node.attr(srcFilter);
		let sourceSrc = this.getFilePath(src);
		newSrc = './' + sourceSrc;
		if (relativeValue != 'true') {
			let name = this.getFileName(sourceSrc);
			if (name) {
				newSrc = './' + relativeValue.replace(/{name}/,name)
			}
		}
		this.node.attr(srcFilter,newSrc);
	}
	replaceFun(replaceValue) {

		if (replaceValue == 'remove') {
			this.removeFun();
		} else {
			this.node.attr(this.srcFilter,replaceValue)
		}
	}
	absoluteFun(absoluteValue) {
		// console.log(process);
		let srcFilter = this.srcFilter;
		let src = this.node.attr(srcFilter);
		let sourceSrc = this.getFilePath(src);
		let fileName = this.getFileName(sourceSrc);
		
		let version = this.transformConfig.version;
		let appname = this.transformConfig.appname;
		let aliEnv = this.transformConfig.ali;
		if (!version) {
			console.log('没有获取到版本号，请检查分支'.error);
			return;
		}
		let newSrc
		if (aliEnv) {
			absoluteValue = absoluteValue || sourceSrc;
			if (aliEnv == 'dev') {
				newSrc = '//g.assets.daily.taobao.net/mtb/' + appname + '/' + version + '/' + absoluteValue;
			} else {
				newSrc = '//g.alicdn.com/mtb/' + appname + '/' + version + '/' + absoluteValue;
			}	
			newSrc = newSrc.replace(/{name}/,fileName);
		} else {
			newSrc = absoluteValue
						.replace(/{appname}/,appname)
						.replace(/{version}/,version)
						.replace(/{name}/,fileName);
		}
		this.node.attr(srcFilter,newSrc);
	}
}