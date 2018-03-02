const argv = require('yargs').argv;
const path = require('path');
const cur_path= process.cwd();
var src = argv.src || argv.s;
var out = argv.outDir || argv.o;
var appname = path.basename(cur_path);
var transformConfig = {
	removeTag: argv.removeAttr || argv.m || 'remove',
	inlineTag: argv.inlineAttr || argv.i || 'inline',
	relativeTag: argv.relativeAttr || argv.l || 'relative',
	replaceTag: argv.replaceAttr || argv.p || 'publish',
	absoluteTag: argv.absoluteAttr || argv.a || 'absolute',
	appname: argv.appname || argv.n || appname,
	version: argv.version || argv.v,
	ali: argv.ali 
}
 
function getVersion() {
	var gitHeadPath = path.join(cur_path,'./.git/HEAD');
	return new Promise((resolve, reject) => {
		fs.readFile(gitHeadPath,'utf8',function(err,file) {
			if (err) {
				console.log(err);
				resolve && resolve(false);
			} else {
				let partten = file.match(/heads\/(.*)/);
				let branchName = partten && partten[1];
				if (branchName) {
					let version = branchName.split('/')[1] || false;
					resolve && resolve(version);
				} else {
					resolve && resolve(false);
				}
			}
		})
	})
}

getVersion().then(function(version) {
	if (!transformConfig.version) {
		transformConfig.version = version;
	}
})
var config = {
	src: path.join(cur_path, src),
	out: path.join(cur_path, out),
	transformConfig: transformConfig
}


export default config;
