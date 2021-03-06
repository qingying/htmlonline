import File from './file.js';
const argv = require('yargs').argv;
const path = require('path');
const fs = require('fs');
const Request = require('request');
const cur_path= process.cwd();

/*
config
	src: 源目录, path.join过的路径
	out: 最终生成的目录, path.join过的路径
	transformConfig: 
		removeTag: 移除标签属性名称
		inlineTag: 替换成inline标签属性名称
		relativeTag: 替换成相对路径标签属性名称
		replaceTag: 替换成对应链接的属性名称
		absoluteTag: 替换成线上路径
		ali: 是否要用阿里线上路径匹配规则
		appname: 应用名称
		version: 版本号
*/
export default class Htmlonline {
	constructor(config) {
		this.src = config.src;
		this.out = config.out;
		this.transformConfig = config.transformConfig;
		if (!this.src || !this.out) {
			console.log('文件路径没传'.error)
		} else {
			// this.getCompletePath();
			this.processFile();
		}
	}
	getCompletePath() {
		// this.src = path.join(cur_path, this.src);
		// this.out = path.join(cur_path, this.out);
	}
	processFile() {
		let src = this.src;
		let self = this;
		fs.stat(src, function(err,stats) {
			if (err) {
				console.log(err);
				console.log( src + ' get fail'.error);
				throw new Error('fail')
				return;
			}
			if (stats.isFile(src)) {
				// 文件
				let fileName = path.basename(src);
				let filePath = path.dirname(src);
				self.newFile(filePath, fileName)
			} else {
				// 路径
				fs.readdir(src,function(err,files){
					files.forEach(function(fileName) {
						self.newFile(src, fileName)
					})
				})
			}
		})
	}
	newFile(filePath, fileName) {
		let self = this;
		new File({
			filePath: filePath,
			fileName: fileName,
			outDir: self.out,
			transformConfig: self.transformConfig
		});
	}
}