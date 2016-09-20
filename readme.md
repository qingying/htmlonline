### 配置项
--src: 源文件
--outDir: 输出路径
个性化配置
--removeAttr: '',移除这个标签控制字段名，默认'remove'
--inlineAttr: '';行内标签嵌入资源文件方式控制字段名，默认值'inline'
--replaceAttr: '';资源链接需要替换，传的值需要和html文件里标签上的属性名对应上
--relativeAttr: ''转换成相对路径控制字段名,默认'relative';
--isOnlineAttr: ''是否换成显示路径控制字段，默认'online'
--onlineAttr: ''转换成线上路径规则，支持正则，可替换字段version:当前分支号，filename:build之后的目录结构


### html源文件资源标签上的配置属性

<script src="" inline=true  relative=false replaceAttrValue="url" online=true></script>


### 思路
输入一个路径* 
输入一个文件*
多个文件，多个路径输入 delay

移除标签*
下载资源*
下载不同文件相同文件名资源 ,场景不是很多，处理成本较大，delay
本地文件内联 *
替换成相对路径 *
替换成日常或者线上链接

todo list
高亮显示异常提示 
webpack 打包