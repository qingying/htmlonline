const program = require('commander');

program
.option('-s, --src', '源文件目录')
.option('-o --outDir', '输出文件目录')
.option('-m --removeAttr', '删除标签，默认remove')
.option('-i --inlineAttr', 'js和css文件内置到html, 默认inline')
.option('-l --relativeAttr', '替换成相对路径，默认relative')
.option('-p --replaceAttr', '替换成其他链接，默认publish')
.option('-a --absoluteAttr', '替换成绝对路径链接，默认absolute')
.option('-ali --ali', '是否是阿里环境')
.option('-n --appname', '应用名称，默认为当前目录名')
.option('-v --version', '版本号，默认为当前分支号后面的数字')
.parse(process.argv)

module.exports = program;