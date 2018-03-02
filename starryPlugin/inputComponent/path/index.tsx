import * as React from 'react'
import { Input, Icon } from 'antd'

export interface IPathInputProps {
    tip: string
    projectPath: string
    inputValue: string
    isDirectory: boolean 
    changeValue: Function
}
export default class InputPathItem extends React.Component<IPathInputProps, any> {
    private inputFile: HTMLInputElement
    public componentDidMount() {
        if ( this.props.isDirectory) {
            this.inputFile.setAttribute('webkitdirectory', 'true')
            this.inputFile.setAttribute('multiple', 'true')
            this.inputFile.setAttribute('directory', 'true')
        }
    }
    private changeFilePath(e) {
        this.props.changeValue(e.target.files[0].path)
    }
    private resetPath(e) {
        e.target.value = null
    }
    render() {
        let { projectPath, inputValue, tip } = this.props
        inputValue = inputValue || projectPath
        return <div className='dictory-input input-wrap'>
            <label className='tip'>{`${tip}:`}</label>
            <Input className='text-input' type='text' value={inputValue} onChange={(e) => this.props.changeValue(e.target.value)}/>
            <div className='upload-button-wrap btn'>
                <input onClick={(e) => this.resetPath(e)} onChange={(e) => this.changeFilePath(e)} type='file' ref={(el) => { this.inputFile = el; }} />
                <div className='upload-button'>
                    <Icon type='upload' />
                    <span>选择文件</span>
                </div>
            </div>
        </div>
    }
}
