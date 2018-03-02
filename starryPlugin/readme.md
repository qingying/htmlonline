### inputConfig
#### properties 
```
"properties": {
    "key": // 对应于最终调用类入参的key
        {
            "type": "path", //类型：path, text, radio, boolean
            "title": "输入提示",
            "isDirectory": "boolean", //是否需要是文件夹
            "default": "默认值" //path, 默认值不填时，为当前项目目录
        },
    "key": 
    {
        "type": "radio",
        "title": "",
        "default": "",
        "valueList": [
            {
                "title": "显示名称, 不填默认为value",
                "value": "代码中的值"
            }
        ]
    },
    "key": 
    {
        "type": "object", //仅支持一级object嵌套
        "title": "",
        "properties": {}
    }
}
```