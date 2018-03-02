const { inputConfig, helpLink } = require('./config.json')
import * as React from 'react'
import * as Path from 'path'
import { Input, Icon, Button } from 'antd'
import InputPathItem from './inputComponent/path/index'
import InputStringItem from './inputComponent/string/index'
import InputBooleanItem from './inputComponent/boolean/index'
import InputRadioItem from './inputComponent/radio/index'
import './app.scss'
import './inputComponent/style/index.scss'
import { ipcRenderer } from 'electron'
const saveType = (window as any).saveType
const PLUGIN_NAME = (window as any).pluginName

export default class App extends React.Component<null, any> {
    constructor(props, context) {
        super(props)
        let config = {}
        this.getConfigValue(inputConfig.properties, config)
        this.state = {
            config,
            projectPath: ''
        }
    }
    getConfigValue(inputConfig, data) {
        for (let i in inputConfig) {
            let { type, properties } = inputConfig[i]
            if (type === 'object') {
                data[i] = {}
                this.getConfigValue(properties, data[i])
            } else {
                data[i] = inputConfig[i].default
            }
        }
    }
    saveData() {
        // 存储插件配置数据
        let { config } = this.state
        ipcRenderer.sendToHost('plugin:saveLocalData', {
            pluginName: PLUGIN_NAME,
            config,
            type: saveType
        })
        new (window as any).Fun(config)
    }
    async componentDidMount() {
        // 查询插件存储数据
        ipcRenderer.sendToHost('plugin:searchLocalData', {
            pluginName: PLUGIN_NAME
        })
        // 查询全局信息
        ipcRenderer.sendToHost('golbal:searchGolbalData', {})
        // 获取全局数据
        ipcRenderer.on('golbal:getGolbalData', (e,args) => {
            // let { projectPath, starryPath} = args
            let projectPath = args.projectPath
            this.setState({
                projectPath
            })
        })
        ipcRenderer.on('plugin:getLocalData', (e, args) => {
            // 获取插件存储数据
            let { starryConfig, projectConfig} = args
            console.log(args[saveType + 'Config'])
            if (args[saveType + 'Config'] && args[saveType + 'Config']) {
                this.setState({
                    config: args[saveType + 'Config']
                })
            }
        })
        // 获取服务链接
        ipcRenderer.sendToHost('plugin:serchServerInfo', {
            pluginName: PLUGIN_NAME
        })
        ipcRenderer.on('golbal:getServerInfo', (e,args) => {
            console.log(args)
            // args.link 服务链接,例如：http://30.8.41.177:4321/plugins/pluginName
        })
    }
    updateConfig() {
        // let config = this.state.config
        // config[key] = value
        this.setState({
            config: this.state.config
        })
    }
    openUrl(url) {
        // 系统浏览器打开页面
        ipcRenderer.sendToHost('golbal:openUrl', {url: url})
    }
    render() {
        let { config, projectPath } = this.state
        return <div className="container">
            { helpLink ? <p className="helper" onClick={() => this.openUrl(helpLink)}>配置帮助</p> : null }
            <RenderObject data={config} changeValue={() => this.updateConfig()} projectPath={projectPath} inputConfig={inputConfig}/>
            <Button className='save-btn' type='primary' onClick={() => this.saveData()}>确定</Button>
        </div>
    }
}

export interface RenderObjectProps {
    data: any
    changeValue: Function
    projectPath: string
    inputConfig: any
}
class RenderObject extends React.Component<RenderObjectProps, any> {
    changeValue(key, value) {
        if (value != undefined) {
            this.props.data[key] = value
        }
        this.props.changeValue()
    }
    getContent(item, key ,index) {
        let { data, projectPath } = this.props
        let { type, title, isDirectory, valueList } = item
        let props = {
            key: index,
            tip: title,
            inputValue: data[key],
            projectPath: projectPath,
            changeValue: (value) => this.changeValue(key, value)
        }
        switch( type) {
            case 'path':
                return <InputPathItem isDirectory={isDirectory} {...props}/>
            case 'object':
                return <RenderObject data={data[key]} {...props} inputConfig={item}/>
            case 'string':
                return <InputStringItem {...props} />
            case 'boolean':
                return <InputBooleanItem {...props}/>
            case 'radio':
                return <InputRadioItem valueList={valueList}  {...props}/>
            default:
                return
            }
    }
    render() {
        let { title, properties } = this.props.inputConfig
        return <div className='object-container'> 
            <p className="object-title">{title}</p>
            <div className="object-wrap">
                {
                    Object.keys(properties).map((item, index) => {
                        let data = properties[item]
                        return this.getContent(data, item, index)
                    })
                }
            </div>
        </div>
    }
}
