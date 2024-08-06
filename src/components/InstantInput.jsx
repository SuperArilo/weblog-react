import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
//样式
import style from './InstantInput.module.scss'
import Theme from './InstantInput.Theme.module.scss'
//方法
import $ from 'jquery'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
//组件
import TextField from '@mui/material/TextField'
import Icon from './Icon'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

const InstantInput = forwardRef(({ label = '未设置', type = 'text', value = '未设置', mode = 'input', width = null, placeholder = '未设置', onErrorMessage, renderObject = [{ id: 0, title: '未设置' }], handleClose = () => null, handleSave = () => null }, ref) => {

    const mainRef = useRef(null)
    const iconDivRef = useRef(null)
    const [inputConetnt, setInputContent] = useState(value)
    //theme
    const isDark = useSelector(state => state.theme.isDark)

    useEffect(() => {
        $(iconDivRef.current).css({ 'height': $(mainRef.current).height() })
    })

    useImperativeHandle(ref, ()=> {

    })
    return (
        <div className={`${style.instant_input} ${isDark ? Theme.dark_instant_input:Theme.light_instant_input}`}>
            <div ref={mainRef} className={style.main_content}>
                {
                    mode === 'input' &&
                    <TextField
                        type={type}
                        style={{width: width}}
                        label={label}
                        defaultValue={value}
                        variant="filled"
                        onChange={e => {
                            setInputContent(e.target.value)
                        }}/>
                    
                }
                {
                    mode === 'textarea' &&
                    <TextField
                        fullWidth
                        type={type}
                        style={{width: width}}
                        hiddenLabel
                        placeholder={placeholder}
                        error={inputConetnt === '' || inputConetnt === null}
                        defaultValue={value}
                        variant="filled"
                        onChange={e => {
                            setInputContent(e.target.value)
                        }}
                    />
                }
                {
                    mode === 'select' &&
                        <FormControl variant="filled" sx={{width: '6rem'}}>
                            <InputLabel>{label}</InputLabel>
                            <Select
                                value={inputConetnt}
                                onChange={e => { 
                                    setInputContent(e.target.value)
                                }}>
                                {
                                    renderObject.map(item => {
                                        return <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                }
                <div ref={iconDivRef} className={style.function_handle}>
                    <Icon
                        width='1rem'
                        height='1rem'
                        name='Close'
                        onClick={() => { handleClose() }} />
                    <Icon
                        width='1rem'
                        height='1rem'
                        name='Save'
                        onClick={() => {
                            if(inputConetnt === '' || inputConetnt === null) {
                                toast('必须要填写内容哦')
                                return
                            }
                            handleSave(inputConetnt)
                        }}>
                    </Icon>
                </div>
            </div>
            {
                onErrorMessage && <span className={`${style.error_message} ${(inputConetnt === '' || inputConetnt === null) && style.error_message_active}`}>{onErrorMessage}</span>
            }
            
        </div>
    )
})
export default InstantInput