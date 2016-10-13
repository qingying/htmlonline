var Htmlonline = require('../build/lib/htmlonline').default;
var assert = require('assert');
var cheerio = require('cheerio');
var ProcessNode = require('../build/lib/ProcessNode').default;

describe('htmlonline功能测试', function() {
	var transformConfig = {
		removeTag: 'remove',
		inlineTag: 'inline',
		relativeTag: 'relative',
		replaceTag: 'publish',
		absoluteTag: 'absolute',
	}
	it('absolute tag in Ali', function() {
		var config = JSON.parse(JSON.stringify(transformConfig));
		config.version = '1.0.0';
		config.appname = 'test';
		config.ali = true;
		var $ = cheerio.load('<script absolute="{name}.js" src="http://takeout.wapa.taobao.com:3002/build/js/inviteNewer.debug.js"></script>');
		var el = $('script');
		var newNode = new ProcessNode({
			node: el,
			transformConfig: config,
			waitDownload: []
		}).node;
		var newSrc = newNode.attr('src');
		var rightSrc = '//g.alicdn.com/mtb/test/1.0.0/js/inviteNewer.js';
		assert.equal(newSrc,rightSrc)
	})

	it('absolute tag not in ali', function() {
		var config = JSON.parse(JSON.stringify(transformConfig));
		config.version = '1.0.0';
		config.appname = 'test';
		var $ = cheerio.load('<script absolute="//g.othercdn.com/mtb/{appname}/{version}/{name}.js" src="http://takeout.wapa.taobao.com:3002/build/js/inviteNewer.debug.js"></script>');
		var el = $('script');
		var newNode = new ProcessNode({
			node: el,
			transformConfig: config,
			waitDownload: []
		}).node;
		var newSrc = newNode.attr('src');
		var rightSrc = '//g.othercdn.com/mtb/test/1.0.0/js/inviteNewer.js';
		assert.equal(newSrc,rightSrc)
	})

	it('inline tag todo', function() {
		var config = JSON.parse(JSON.stringify(transformConfig));
		var $ = cheerio.load('<script inline src="http://g.alicdn.com/mtb/lib-flexible/0.3.4/flexible.js"> </script>');
		var el = $('script');
		var newNode = new ProcessNode({
			node: el,
			transformConfig: config,
			waitDownload: []
		}).node;
		// assert.equal(newSrc,rightSrc)
	})

	it('relative tag', function() {
		var config = JSON.parse(JSON.stringify(transformConfig));
		var $ = cheerio.load('<script relative="{name}.min.js" src="http://takeout.wapa.taobao.com:3002/build/js/inviteNewer.debug.js"></script>');
		var el = $('script');
		var newNode = new ProcessNode({
			node: el,
			transformConfig: config,
			waitDownload: []
		}).node;
		var newSrc = newNode.attr('src');
		var rightSrc = './js/inviteNewer.min.js';
		assert.equal(newSrc,rightSrc)
	})
	it('remove tag', function() {
		var config = JSON.parse(JSON.stringify(transformConfig));
		var $ = cheerio.load('<script remove src="http://g.alicdn.com/mtb/lib-flexible/0.3.4/flexible.js"></script>');
		var el = $('script');
		var newNode = new ProcessNode({
			node: el,
			transformConfig: config,
			waitDownload: []
		})
		var len = $('script').length;
		assert.equal(len, 0);
	})

	it('replace tag', function() {
		var config = JSON.parse(JSON.stringify(transformConfig));
		var $ = cheerio.load('<script publish="aaas" src="//h5.m.taobao.com/app/mtblib/react/0.14.3/react.min.js"></script>');
		var el = $('script');
		var newNode = new ProcessNode({
			node: el,
			transformConfig: config,
			waitDownload: []
		}).node;
		var newSrc = newNode.attr('src');
		var rightSrc = 'aaas';
		assert.equal(newSrc,rightSrc)
	})
})