var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

var cheerio = require('cheerio');
var uglify = require('uglify-js');
var cssmin = require('ycssmin').cssmin;
var fs = require('fs');
var fsutil = require('fsmore');
var url = require('url');
var http = require('http');
var coimport = require('coimport');


var PluginError = gutil.PluginError;
var pluginName = 'gulp-htmonline';

var TEMP_DIR_COMMON = 'htmonline_temp';

var localParten = new RegExp('\\.\/');
var comboParten = new RegExp('\\?\\?');
var linkHost = {
    'online': '//g.alicdn.com/mtb/',
    'daily': '//g-assets.daily.taobao.net/mtb/'
}

function extend(dest, source, isOverwrite) {
    if (isOverwrite == undefined) isOverwrite = true;
    for (var k in source) {
        if (!(k in dest) || isOverwrite) {
            dest[k] = source[k]
        }
    }
    return dest;
}

var __uniqueId = function() {
    var i = 0;
    return function() {
        return i++;
    }
}();

// js process
var JsProcessor = function($, options, cb) {
    this.doneJs = 0;
    this.isDone = false;
    this.cb = cb;
    this.options = options;
    this.$js = $('script');
    this.$ = $;
    var js = this.$js;
    var me = this;
    var htmlpath = options.htmlpath;
    var comboScriptEl;

    if (js.length === 0) {
        this.isDone = true;
        this.cb && this.cb();
    } else {
        js.each(function(i, el) {
            var $el = $(this);
            var src = $(this).attr('src');
            var type = $(this).attr('type');
            var oldCon = $(this).html();
            var newCon = '\n';
            var isKeepInline = $el.is(options.keepInlineSelector);
            if ((!type || type === 'text/javascript') && !!src && isKeepInline) {
                // 插入js代码到本地
                if (localParten.test(src)) {
                    // 本地代码，直接插入
                    var jssrc = path.join(path.dirname(htmlpath), src);
                    if (fs.lstatSync(jssrc).isFile()) {
                        newCon += fs.readFileSync(jssrc, {
                            encoding: 'utf8'
                        });
                        me.__minifyAndReplace($el, newCon);
                        me.__checkJsDone();
                    } else {
                        console.log('"' + src + '" in "' + htmlpath + '" is an invalid file or url!');
                    }
                } else {
                    // 线上代码，先下载再插入
                    //download & replace
                    if (comboParten.test(src)) {
                        //cdn combo 链接
                        var destPath = path.join('cdn_combo_' + __uniqueId() + '.js');
                    } else {
                        //其他线上链接
                        var destPath = path.join('cdn_' + __uniqueId() + '.js');
                    }
                    fsutil.download(src, destPath, function($js, destPath) {
                        return function() {
                            console.log('"' + destPath + '" downloaded!');
                            me.__minifyAndReplace($el, fs.readFileSync(destPath, {
                                encoding: 'utf8'
                            }));
                            me.__checkJsDone();

                            fs.unlinkSync(destPath);
                        }
                    }($el, destPath));
                }
            } else {
                if(comboParten.test(src)) {
                    comboScriptEl = el;
                }
                if (localParten.test(src)) {
                    // 引用的本地路径，替换成日常链接或者combo
                    //todo 取出需要替换路径的线上文件名
                    var name = src.match(/(build|dest|dist)\/(.*)/);
                    if(name && name[2]){
                        name = name[2];
                        name = name.replace(/\.debug/g,'').replace(/"/,'');
                    } else {
                        // 如果不在生成的目录，则直接取最终文件名
                        name = src.match(/[^\/]*\.js$/);
                        if (name && name[0]) {
                            name = name[0];
                        }
                    }
                    var filename = name;
                    var fileSrc = options.appName + '/' + options.appVersion + '/' + filename;
                    if (options.publish) {
                            if (comboScriptEl) {
                                // 删除当前script ,修改combo script src
                                var comboSrc = $(comboScriptEl).attr('src') + ',' + fileSrc;
                                $(comboScriptEl).attr('src',comboSrc);
                                $el.remove();
                            } else {
                                //替换当前script src;
                                var newSrc = linkHost.online +  fileSrc;
                                $el.attr('src', newSrc);
                            }
                    } else {
                        // 替换
                        var newSrc = linkHost.daily +  fileSrc;
                        $el.attr('src', newSrc);
                    }
                }
                me.__checkJsDone();
            }

        });
    }
};
JsProcessor.prototype = {
    __minifyAndReplace: function($el, jscon) {
        if (this.options.jsminify) {
            jscon = uglify.minify(jscon, {
                fromString: true,
                mangle: true
            }).code;
        }

        // do not use .html()
        $el.empty().removeAttr('src');
        var replaceStr = this.$.html($el).replace(/<\/script>/i, '') + jscon + '</script>';
        $el.replaceWith(replaceStr);
    },
    __checkJsDone: function() {
        this.doneJs++;
        if (this.doneJs === this.$js.length) {
            this.isDone = true;
            this.cb && this.cb();
        }
    }
};

// css processor
var CssProcessor = function($, options, cb) {
    this._done = 0;
    this.options = options;
    this.cb = cb;

    this.$ = $;
    this.$css = $('link[rel=stylesheet]');
    this.fixRelaPath = path.relative(options.destDir, './');

    var css = this.$css;
    var htmlpath = options.htmlpath;
    var me = this;

    if (css.length === 0) {
        this.isDone = true;
        this.cb && this.cb();
    } else {
        css.each(function(i, el) {
            var href = $(this).attr('href');
            var newCon = '\n';
            var $css = $(this);

            if (!/^http/.test(href)) {
                var csshref = path.join(path.dirname(htmlpath), href);
                if (fs.lstatSync(csshref).isFile()) {
                    newCon += (fs.readFileSync(csshref, {
                        encoding: 'utf8'
                    }) + '\n');
                    var coimportFile = csshref + '.coimport';
                    fs.writeFileSync(coimportFile, newCon, {
                        encoding: 'utf8'
                    });
                    if (options.coimport) {
                        //todo
                        coimport(coimportFile, function($css, csshref, coimportFile) {
                            return function(newStr) {
                                me.__cssMinifyAndReplace($css, csshref, newStr);
                                fsutil.rmdirSync(coimportFile);
                            }
                        }($css, csshref, coimportFile))
                    } else {
                        me.__cssMinifyAndReplace($css, csshref, newCon);
                    }
                } else {
                    console.log('"' + href + '" in "' + htmlpath + '" is an invalid file or url!');
                }
            } else {
                if (/\?\?/.test(href)) {
                    //cdn combo
                    var tempDestFile = path.join(TEMP_DIR, 'cdn_combo_' + __uniqueId() + '.css');
                } else {
                    var tempDestFile = path.join(TEMP_DIR, url.parse(href).pathname);
                }

                fsutil.download(href, tempDestFile, function($css, tempDestFile) {
                    return function() {
                        console.log('"' + tempDestFile + '" downloaded!');
                        var cssStr = fs.readFileSync(tempDestFile, {
                            encoding: 'utf8'
                        });
                        cssStr = me.fixAssetsPath(href, cssStr);
                        var coimportFile = tempDestFile + '.coimport';
                        fs.writeFileSync(coimportFile, cssStr, {
                            encoding: 'utf8'
                        });

                        if (options.coimport) {
                            coimport(coimportFile, function($css, csshref) {
                                return function(newStr) {
                                    me.__cssMinifyAndReplace($css, csshref, newStr);
                                }
                            }($css, href))

                        } else {
                            me.__cssMinifyAndReplace($css, href, cssStr);
                        }
                    }
                }($css, tempDestFile));
            }

        });
    }
};
CssProcessor.prototype = {
    _checkCssDone: function() {
        if (this._done === this.$css.length) {
            this.isDone = true;
            this.cb && this.cb();
        }
    },
    __cssMinifyAndReplace: function($css, sourcePath, cssCon) {
        var $ = this.$;
        var me = this;
        if (this.options.cssminify) {
            cssCon = cssmin(cssCon);
        }
        cssCon = me.fixAssetsPath(sourcePath, cssCon);
        var style = $('<style>' + cssCon + '</style>');
        $css.replaceWith(style);
        this._done++;
        this._checkCssDone();
    },
    fixAssetsPath: function(sourcePath, cssStr) {
        var con = this.uniform(cssStr);
        var dirname = path.dirname(this.options.htmlpath);
        var b = sourcePath;
        var me = this;
        // fix relative path or `url`
        con = con.replace(/url\(\s*([\S^\)]+)\s*\)/g, function(c, d) {
            if (/^http/.test(d)) return c;
            var file_dirname = path.dirname(path.resolve(dirname, b));
            var assetpath = path.resolve(file_dirname, d);
            assetpath = path.relative(dirname, assetpath);
            if (!/^http/.test(assetpath)) {
                assetpath = path.join(me.fixRelaPath, assetpath);
            }
            return 'url(' + assetpath + ')';
        });
        // fix relative path of `import string`
        con = con.replace(/@import\s*"([^"]+)"\s*;/g, function(e, f) {
            if (/^http/.test(f)) return e;
            var file_dirname = path.dirname(path.resolve(dirname, b));
            var assetpath = path.resolve(file_dirname, f);
            assetpath = path.relative(dirname, assetpath);
            if (!/^http/.test(assetpath)) {
                assetpath = path.join(me.fixRelaPath, assetpath);
            }
            return '@import "' + assetpath + '";';
        });
        return con;
    },
    uniform: function(css) {
        // uniform @import
        css = css
            .replace(/@import\s+url\(\s*"([^"]+)"\s*\)\s*;/g, '@import "$1";')
            .replace(/@import\s+url\(\s*\'([^\']+)\'\s*\)\s*;/g, '@import "$1";')
            .replace(/@import\s+url\(\s*([\S^\)]+)\s*\)\s*;/g, '@import "$1";')
            .replace(/@import\s*"([^"]+)"\s*;/g, '@import "$1";')
            .replace(/@import\s*\'([^\']+)\'\s*;/g, '@import "$1";');

        // uniform url()
        css = css
            .replace(/url\(\s*"([^"]+)"\s*\)/g, 'url($1)')
            .replace(/url\(\s*\'([^\']+)\'\s*\)/g, 'url($1)')
            .replace(/url\(\s*([\S^\)]+)\s*\)/g, 'url($1)');

        return css;
    }
};

var dealScripts = function(htmlpath, htmlFrag, options, cb) {

    //console.log(htmlFrag, options);
    var $ = cheerio.load(htmlFrag, {
        decodeEntities: false,
        normalizeWhitespace: false
    });
    if (options.removeSelector) {
        $(options.removeSelector).remove();
    }
    options.htmlpath = htmlpath;

    // deal js
    var todownloadCss = 0;
    var downloadedCss = 0;
    var isJsDone = false;
    var isCssDone = false;

    var __checkAllDone = function() {
        if (isJsDone && isCssDone) {
            cb && cb($.html());
        }
    };


    var jser = new JsProcessor($, options, function() {
        isJsDone = true;
        __checkAllDone();
    });

    // deal css
    var csser = new CssProcessor($, options, function() {
        isCssDone = true;
        __checkAllDone();
    })

};


module.exports = function(opt) {
    var options = extend({
        removeSelector: '[will-remove]',
        keepliveSelector: '[keeplive]',
        keepInlineSelector: '[keep-inline]',
        destDir: './',
        coimport: true,
        cssminify: true,
        jsminify: true,
        online: true
    }, (opt || {}));

    var _todo = 0;
    var _done = 0;
    TEMP_DIR = TEMP_DIR_COMMON + options.publish;
    function transform(file, enc, cb) {
        if (file.isNull()) return cb(null, file);
        if (file.isStream()) return cb(new PluginError(pluginName, 'Streaming not supported'));

        var data;
        var str = file.contents.toString('utf8');
        var filepath = file.path;
        _todo++;
        dealScripts(filepath, str, options, function(html) {
            file.contents = new Buffer(html);
            cb(null, file);

            _done++;
            if (_done === _todo) {
                gutil.log(gutil.colors.cyan('>> All html done!'));
            }
        });
    }

    return through.obj(transform);
}