import * as React from 'react'
import { Input, Icon } from 'antd'

export interface IStringInputProps {
    tip: string
    inputValue: string
    changeValue: Function
}
export default class InputStringItem extends React.Component<IStringInputProps, any> {
    render() {
        let { inputValue, tip } = this.props
        return <div className='dictory-input input-wrap'>
            <label className='tip'>{`${tip}:`}</label>
            <Input className='text-input' type='text' value={inputValue} onChange={(e) => this.props.changeValue(e.target.value)}/>
        </div>
    }
}
