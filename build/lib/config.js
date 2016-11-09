'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var argv = require('yargs').argv;
var path = require('path');
var cur_path = process.cwd();
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
};

function getVersion() {
	var gitHeadPath = path.join(cur_path, './.git/HEAD');
	return new Promise(function (resolve, reject) {
		fs.readFile(gitHeadPath, 'utf8', function (err, file) {
			if (err) {
				resolve && resolve(false);
			} else {
				var partten = file.match(/heads\/(.*)/);
				var branchName = partten && partten[1];
				if (branchName) {
					var version = branchName.split('/')[1] || false;
					resolve && resolve(version);
				} else {
					resolve && resolve(false);
				}
			}
		});
	});
}

getVersion().then(function (version) {
	if (!transformConfig.version) {
		transformConfig.version = version;
	}
});
var config = {
	src: src,
	out: out,
	transformConfig: transformConfig
};

exports.default = config;