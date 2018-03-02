import * as React from 'react'
import { Switch } from 'antd'

export interface IBooleanInputProps {
    tip: string
    inputValue: boolean
    changeValue: Function
}
export default class InputBooleanItem extends React.Component<IBooleanInputProps, any> {
    render() {
        let { inputValue, tip } = this.props
        return <div className='dictory-input input-wrap'>
            <label className='tip'>{`${tip}:`}</label>
            <Switch className='text-input boolean-icon' checked={inputValue} onChange={(checked) => this.props.changeValue(checked)}/>
        </div>
    }
}
