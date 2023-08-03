import React, { useState, useEffect, useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from 'react'
//样式
import style from '../assets/scss/components/instantInput.module.scss'
//方法
import $ from 'jquery'
import toast from 'react-hot-toast'
//组件
import WaterWave from './WaterWave'
import TextField from '@mui/material/TextField'
import Icon from './Icon'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

const InstantInput = forwardRef((props, ref) => {

    const mainRef = useRef(null)
    const iconDivRef = useRef(null)
    const [inputConetnt, setInputContent] = useState(props.value)


    useEffect(() => {
        $(iconDivRef.current).css({ 'height': $(mainRef.current).height() })
    })

    useImperativeHandle(ref, ()=> {

    })
    return (
        <div className={`${style.instant_input}`}>
            <div ref={mainRef} className={style.main_content}>
                {
                    props.mode === 'input' &&
                    <TextField
                        type={props.type}
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
                        type={props.type}
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
                <div ref={iconDivRef} className={style.function_handle}>
                    <Icon iconClass='close' onClick={() => { props.handleClose() }}>
                        <WaterWave color="rgb(155, 195, 219)" duration={ 1 } />
                    </Icon>
                    <Icon
                        iconClass='save'
                        onClick={() => {
                            if(inputConetnt === '' || inputConetnt === null) {
                                toast('必须要填写内容哦')
                                return
                            }
                            props.handleSave(inputConetnt)
                        }}>
                        <WaterWave color="rgb(155, 195, 219)" duration={ 1 } />
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
    type: 'text',
    value: '未设置',
    mode: 'input',
    width: null,
    placeholder: '未设置',
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