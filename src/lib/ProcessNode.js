require('./color');
export default class ProcessNode {
	constructor(config) {
		this.node = config.node;
		// this.type = config.type;
		this.transformConfig = config.transformConfig;
		this.waitDownload = config.waitDownload;
		this.version = config.version;
		this.processNode();
	}
	processNode() {
		if (this.filterNode('removeTag')) {
			// 移除标签
			return this.removeFun();
		}
		if (this.filterNode('inlineTag')) {
			// 内联文件
			return this.inlineFun();
		}
		let relativeValue = this.filterNode('relativeTag');
		if (relativeValue) {
			// 替换相对路径
			return this.relativeFun(relativeValue);
		}
		let replaceValue = this.filterNode('replaceTag')
		if (replaceValue) {
			// 替换成配置链接
			this.replaceFun(replaceValue);
		}
		let onlineValue = this.filterNode('onlineTag')
		if (onlineValue) {
			// 替换成线上链接
			this.onlineFun(onlineValue);
		}
	}
	filterNode(filter) {
		let value = this.node.attr(this.transformConfig[filter]);
		this.node.removeAttr(this.transformConfig[filter]);
		return value;
	}
	getFileName(src) {
		let sourceSrc;
		let partten = src.match(/(build|dest|dist)\/(.*)/);
		if (partten) {
			sourceSrc = partten[2];
		} else {
			console.log(src + '没有找到符合规则的相对路径'.error);
			sourceSrc = false;
		}
		return sourceSrc;
	}
	removeFun() {
		this.node.remove();
	}
	inlineFun() {
		this.waitDownload.push(this.node);
	}
	relativeFun(relativeValue) {
		let newSrc;
		let src = this.node.attr('src');
		let sourceSrc = this.getFileName(src);
		if (!sourceSrc) {
			return;
		}
		newSrc = './' + sourceSrc;
		if (relativeValue != 'true') { 
			let namePartten = sourceSrc.match(/([^\.]*)\.[.]*/);
			if (namePartten) {
				let name = namePartten[1];
				newSrc = './' + relativeValue.replace(/{name}/,name)
			}
		}
		this.node.attr('src',newSrc);
	}
	replaceFun(replaceValue) {
		if (replaceValue == 'remove') {
			this.removeFun();
		} else {
			this.node.attr('src',replaceValue)
		}
	}
	onlineFun(onlineValue) {
		// console.log(process);
		console.log(onlineValue)
		let src = this.node.attr('src');
		let sourceSrc = this.getFileName(src);
		if (!sourceSrc) {
			return;
		}
		let version = this.version;
		let appname = this.transformConfig.appname;
		if (!version) {
			console.log('没有获取到版本号，请检查分支'.error);
			return;
		}

		if (!appname && onlineValue.test(/\{appname\}/)) {
			console.log('没有获取到应用名，请检查配置'.error);
			return;
		}
		let newSrc = onlineValue
					.replace(/{appname}/,appname)
					.replace(/{version}/,version)
					.replace(/{name}/,sourceSrc);
		console.log(newSrc);
	}
}