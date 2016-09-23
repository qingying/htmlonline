### 配置项

#### 必填项

  *  --src: 源文件
  *  --outDir: 输出路径
#### 选填项

tip: 配置的值可以在html文件里当作attribute添加到标签上，html标签上属性名来控制是否执行这项处理，属性值用来定义一些个性化内容

  *  --removeAttr: ''移除这个标签,默认'remove' 
  *  --inlineAttr: ''行内标签嵌入资源文件，默认值'inline'
  *  --replaceAttr:''需要替换资源链接，默认值publish,属性值是delete则删除这个节点
  *  --relativeAttr: ''转换成相对路径,默认'relative';
  *  --absoluteAttr: ''转换成绝对线上地址，默认'absolute'，属性值为地址修改规则，可替换字段version:当前分支号，name:build之后的目录结构
  *  --appname: 替换成线上链接的appname
  *  --ali: dev|pub 阿里日常or线上资源链接拼接规则
