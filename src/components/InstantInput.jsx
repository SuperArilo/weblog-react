import React, { useState, useEffect, useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from 'react'
//样式
import style from '../assets/scss/components/instantInput.module.scss'
//方法
import $ from 'jquery'
import customTips from '../util/notostack/customTips'
//组件
import WaterWave from 'water-wave'
import TextField from '@mui/material/TextField'
import Icon from './Icon'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

const InstantInput = forwardRef((props, ref) => {

    const mainRef = useRef(null)
    const [inputConetnt, setInputContent] = useState(props.value)

    useImperativeHandle(ref, ()=> {

    })
    return (
        <div className={`${style.instant_input}`}>
            <div className={style.main_content}>
                {
                    props.mode === 'input' &&
                    <TextField
                        style={{width: props.width}}
                        label={props.label}
                        defaultValue={props.value}
                        variant="filled"
                        onChange={e => {
                            setInputContent(e.target.value)
                        }}/>
                    
                }
                {
                    props.mode === 'textarea' &&
                    <TextField
                        fullWidth
                        style={{width: props.width}}
                        hiddenLabel
                        placeholder={props.placeholder}
                        error={inputConetnt === '' || inputConetnt === null}
                        defaultValue={props.value}
                        variant="filled"
                        onChange={e => {
                            setInputContent(e.target.value)
                        }}
                    />
                }
                {
                    props.mode === 'select' &&
                        <FormControl variant="filled" sx={{width: '6rem'}}>
                            <InputLabel>{props.label}</InputLabel>
                            <Select
                                value={inputConetnt}
                                onChange={e => { 
                                    setInputContent(e.target.value)
                                    console.log(e.target.value)
                                }}>
                                {
                                    props.renderObject.map(item => {
                                        return <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                }
                <div className={style.function_handle}>
                    <Icon iconClass='close' onClick={() => { props.handleClose() }}>
                        <WaterWave color="rgb(155, 195, 219)" duration={ 500 } />
                    </Icon>
                    <Icon
                        iconClass={`${props.loadingStatus ? 'loading':'save'}`}
                        status={true}
                        onClick={() => {
                            if(inputConetnt === '' || inputConetnt === null) {
                                customTips.warning('必须要填写内容哦')
                                return
                            }
                            props.handleSave(inputConetnt)
                        }}>
                        <WaterWave color="rgb(155, 195, 219)" duration={ 500 } />
                    </Icon>
                </div>
            </div>
            {
                props.onErrorMessage && <span className={`${style.error_message} ${(inputConetnt === '' || inputConetnt === null) && style.error_message_active}`}>{props.onErrorMessage}</span>
            }
            
        </div>
    )
})
InstantInput.defaultProps = {
    label: '未设置',
    value: '未设置',
    mode: 'input',
    width: null,
    placeholder: '未设置',
    loadingStatus: false,
    renderObject: [
        {
            id: 0,
            title: '未设置'
        }
    ],
    handleClose: () => { return null },
    handleSave: () => { return null }

}
export default InstantInput