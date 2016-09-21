import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import Request from 'request';
import ProcessNode from './ProcessNode';
require('./color');
require("babel-polyfill");

export default class File {
	constructor(config) {
		this.transformConfig = config.transformConfig;
		this.filePath = config.filePath;
		this.outDir = config.outDir;
		this.fileName = config.fileName;
		this.version = config.version;
		this.waitDownload = [];
		this.fileContent = '';
		this.outHtml = '';
		this.$ = null;
		this.readFile()
		.then(() => this.processDoc())
		.then(() => this.downloadFiles())
		.then(() => this.writeFile())
		.catch((e) => {
			if (e) {
				console.log(e);
			}
		})
	}
	readFile() {
		let self = this;
		return new Promise((resolve,reject) => {
			let filePath = this.filePath;
			let fileName = this.fileName;
			let readFilePath = path.join(filePath,fileName);
			fs.readFile(readFilePath,'utf8',function(err,file) {
				if (!file) {
					reject && reject();
					return;
				}
				self.fileContent = file;
				resolve && resolve()
			})
		})
	}
	writeFile() {
		this.outHtml = this.$.html();
		if (!fs.existsSync(this.outDir)) {
			fs.mkdirSync(this.outDir)
		}
		let outPath = path.join(this.outDir,this.fileName);
		fs.writeFile(outPath,this.outHtml,function(err){
			if (err) {
				console.log(outPath + '写入失败'.error);
			} else {
				console.log(outPath + '创建成功'.info);
			}
		})
	}
	processDoc() {
		let $ = cheerio.load(this.fileContent);
		this.$ = $;
		this.processNodeList('link');
		this.processNodeList('script');
		this.processNodeList('*[remove=true]');
	}
	processNodeList(filter) {
		let nodeList = this.$(filter);
		nodeList && nodeList.map((item) => {
			this.processNode(nodeList[item],filter);
		})
	}
	processNode(node,type){
		let self = this;
		new ProcessNode({
			node: self.$(node),
			// type: type,
			transformConfig: self.transformConfig,
			waitDownload: self.waitDownload,
			version: self.version
		});
	}
	downloadFiles() {
		let PromiseList = this.waitDownload.map((item) => this.downloadItem(item));
		return Promise.all(PromiseList)
	}
	downloadItem(node) {
		let self = this;
		return new Promise((resolve, reject) => {
			let link = node.attr('src') || node.attr('link');
			if (!link) {
				resolve && resolve()
			}
			if (/\/\//.test(link)) {
				// 线上链接
				if(!/http/.test(link)) {
					link = 'http:' + link;
				}
				Request(link,function(error,response,file) {
					if (!error && response && response.statusCode == 200) {
						self.replaceNode(node,file);
						resolve && resolve();
					} else {
						console.log(link + '下载失败，请检查网络后重试'.error);
						reject && reject();
					}
				})
			} else {
				// 本地文件
				let linkPath = path.join(this.filePath,link);
				let self = this;
				fs.readFile(linkPath,function(err, file) {
					if (err) {
						reject && reject();
					} else {
						self.replaceNode(node, file);
						resolve && resolve();
					}
				})
			}
		})
	}
	replaceNode(node,content) {
		node.removeAttr('src');
		node.removeAttr('script');
		node.text(content);
	}
}