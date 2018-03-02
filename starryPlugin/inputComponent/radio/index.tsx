import * as React from 'react'
import { Radio } from 'antd'
const RadioGroup = Radio.Group

export interface IRadioInputProps {
    tip: string
    valueList: any
    inputValue: boolean
    changeValue: Function
}
export default class InputRadioItem extends React.Component<IRadioInputProps, any> {
    render() {
        let { inputValue, tip, valueList=[] } = this.props
        return <div className='dictory-input input-wrap'>
            <label className='tip'>{`${tip}:`}</label>
            <RadioGroup  value={inputValue} onChange={(e) => this.props.changeValue(e.target.value)}>
                {
                    valueList.map((item, index) => {
                        return <Radio key={index} value={item.value}>{item.titla || item.value}</Radio>
                    })
                }
            </RadioGroup>
        </div>
    }
}
