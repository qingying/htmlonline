const argv = require('yargs').argv;
const path = require('path');
const fs = require('fs');
const Request = require('request');
const glob = require('glob').Glob;
// const colors = require('colors');
// 获取当前路径
const dir_path= process.cwd();
import File from './lib/file.js';

// 获取参数
var src = argv.src;
console.log('dir_path' + dir_path)
var outDir = path.join(dir_path,argv.outDir);

var transformConfig = {
	removeTag: argv.removeAttr || 'remove',
	inlineTag: argv.inlineAttr || 'inline',
	relativeTag: argv.relativeAttr || 'relative',
	replaceTag: argv.replaceAttr,
	onlineTag: argv.isOnlineAttr || 'online',
}
var waitDownload = {};

var cur_path = path.join(dir_path,src);
fs.stat(cur_path, function(err,stats) {
	if (stats.isFile(cur_path)) {
		// 文件
		let fileName = path.basename(cur_path);
		let filePath = path.dirname(cur_path);
		new File({
			filePath: filePath,
			fileName: fileName,
			outDir: outDir,
			transformConfig: transformConfig
		});
	} else {
		// 路径
		fs.readdir(path.join(dir_path,src),function(err,files){
			files.forEach(function(filename) {
				new File({
					filePath: cur_path,
					outDir: outDir,
					fileName: filename,
					transformConfig: transformConfig
				});
			})
		})
	}
})


// function dealFile(filePath) {
// 	fs.readFile(filePath,'utf8',function(err,file) {
// 		if (!file) {
// 			return;
// 		}
// 		let filename = path.basename(filePath);
// 		waitDownload[filename] = [];
// 		let outPath = path.join(dir_path,outDir);
// 		dealHtml(file, waitDownload[filename])
// 		.then((outHtml) => downloadFiles(waitDownload[filename],outHtml))
// 		.then((outHtml) => writeFile(outHtml,outPath,filename))
// 		.catch((e) => {console.log(e)});
// 	})
// }





// function dealHtml(file,fileWaitDownload) {
// 	let p = new Promise(function(resolve,reject) {
// 		let document = parseUtil.parse(file);
// 		getFilterNode(document,fileWaitDownload);
// 		resolve && resolve(document);
// 		// if (fileWaitDownload) {
// 		// 	downloadFiles(fileWaitDownload).then(function(){
// 		// 		resolve && resolve(parseUtil.serialize(document));
// 		// 	})
// 		// } else {
// 		// 	resolve && resolve(document)
// 		// }
// 	})
// 	return p;
// }

// function writeFile(content,outPath,filename) {
// 	if (!fs.existsSync(outPath)) {
// 		fs.mkdirSync(outPath)
// 	}
// 	let outFilePath = path.join(outPath,filename);
// 	content = parseUtil.serialize(content);
// 	fs.writeFile(outFilePath,content,function(){

// 	})
// }

// function getFilterNode(node,fileWaitDownload) {
// 	var nodeName = node.nodeName;
// 	var childNodes = node.childNodes;
// 	if (nodeName && nodeName == 'link') {
		
// 	}

// 	if (nodeName && nodeName == 'script') {
// 		node = dealLink(node,fileWaitDownload);
// 	}

// 	if (childNodes && childNodes.length) {
// 		childNodes.map((item) => {
// 			getFilterNode(item,fileWaitDownload);
// 		})
// 	}
// }


// function dealLink(node,fileWaitDownload) {
// 	// console.log(downloadFileNodes);
// 	// 处理不同方式资源链接
// 	var attrs = node.attrs;
// 	let attrObj = {};
// 	// 数组转对象
// 	attrs.map((item) => {
// 		attrObj[item.name] = item.value;
// 	})
// 	if (parseUtil.getAttribute(node,removeTag)) {
// 		// 移除标签
// 		removeNode(node);

// 	} else if (parseUtil.getAttribute(node,inlineTag)) {
// 		// 下载文件
// 		inlineNode(node,fileWaitDownload);
// 	} else if (parseUtil.getAttribute(node,relativeTag)) {
// 		// 获取相对路径

// 	} else if (parseUtil.getAttribute(node,replaceTag)) {
// 		// 替换链接

// 	} else if (parseUtil.getAttribute(node,isOnlineTag)) {
// 		// 根据onlineReg生成线上链接
// 	} 
// 	// 写入node attrs

// }

// function removeNode(node) {
// 	parseUtil.remove(node);
// }

// function inlineNode(node,fileWaitDownload) {
// 	fileWaitDownload.push(node);
// }


// function downloadFiles(nodeList,outHtml) {
// 	let p = new Promise(function(resolve,reject){
// 		let promiseList = nodeList.map((item) => downLoadItem(item));
// 		Promise.all(promiseList).then(function(){
// 			resolve && resolve(outHtml)
// 		}).catch(reject)
// 	})
// 	return p;
// }

// function downLoadItem(node) {
// 	let p = new Promise(function(resolve,reject) {
// 		let link = parseUtil.getAttribute(node,'src');
// 		if (/\/\//.test(link)) {
// 			// 线上链接
// 			if(!/http/.test(link)) {
// 				link = 'http:' + link;
// 			}
// 			Request(link,function(error,response,file) {
// 				if (!error && response && response.statusCode == 200) {
// 					let newNode = parseUtil.createNode('script');
// 					let text = parseUtil.createTextNode(file);
// 					newNode.childNodes.push(text);
// 					parseUtil.replace(node,newNode);
// 					resolve && resolve();
// 				} else {
// 					console.log(link + '下载失败，请检查网络后重试'.red)
// 				}
// 			})
// 		} else {
// 			// 本地链接

// 		}
// 	})
// 	return p;
// }

