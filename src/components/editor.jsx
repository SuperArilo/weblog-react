import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { useSelector } from 'react-redux'
//样式
import style from './Editor.module.scss'
//组件
import Button from './Button'
import Skeleton from '@mui/material/Skeleton'
//方法
import { customUploadImage } from '../api/Upload'


const Tinymce = forwardRef(({ userInfo = null, placeholder = '在这设置占位符', initialValue,  getContent = () => null }, ref) => {

    const [edValue, setedValue] = useState(initialValue)
    const [modelValue, setModelValue] = useState(null)
    const [instance, setInstance] = useState(null)
    //theme
    const isDark = useSelector(state => state.theme.isDark)
    const [config, setConfing] = useState({
        height: 260,
        skin: isDark ? 'oxide-dark':'oxide',
        placeholder: placeholder,
        content_css: isDark ? 'dark':'default',
        menubar: false,
        branding: false,
        statusbar: true,
        language_url: '/tinymce/langs/zh_CN.js',
        language: "zh_CN",
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'insertdatetime', 'media', 'table', 'help'
        ],
        toolbar: [
            { name: 'styles', items: [ 'styles', 'fontsize', 'image' ] },
            { name: 'formatting', items: ['forecolor', 'bold', 'italic', 'lineheight', 'removeformat', 'hr'] },
            { name: 'alignment', items: [ 'alignleft', 'aligncenter', 'alignright', 'alignjustify' ] },
            { name: 'indentation', items: [ 'bullist', 'numlist', 'outdent', 'indent', 'table' ] },
            { name: 'history', items: [ 'undo', 'redo' ] }
        ],
        style_formats: [
            {
                title: '首行缩进',
                block: 'p',
                styles: { 'text-indent': '2em' }
            }
        ],
        style_formats_merge: true,
        toolbar_mode: 'sliding',
        content_style: 'body { font-size: 10.5pt }',
        font_size_formats: '8pt 8.5pt 9pt 9.5pt 10pt 10.5pt 11pt 11.5pt 12pt 13pt 15pt 18pt 24pt',
        images_upload_handler: (blobInfo, success) => new Promise((resolve, reject) => {
            let data = new FormData()
            data.append('file', blobInfo.blob())
            customUploadImage({ data: data, toast: null }).then(resq => {
                if(resq.code === 200) {
                    resolve(resq.data)
                } else {
                    reject(resq.message)
                }
            }).catch(err => {
                reject(err.message)
            })
        })
    })

    useImperativeHandle(ref, () => ({
        clear: () => {
            setModelValue(null)
            if(instance) {
                instance.setContent('')
            }
        }
    }))
    return <>
            {
                userInfo !== null ?
                <>
                    { instance ? '':<EditorSkeleton /> }
                    <div className={style.editor_tinymce} style={{ display: instance ? 'flex':'none' }}>
                        <Editor
                            tinymceScriptSrc='/tinymce/tinymce.min.js'
                            initialValue={edValue}
                            onInit={(event, instance) => {
                                setInstance(instance)
                            }}
                            init={config}
                            onChange={(event, editor) => {
                                setModelValue(editor.getContent())
                            }} />
                        <div className={style.editor_bottom}>
                            <div className={style.left_user_info}>
                            </div>
                            <Button
                                text='提交'
                                onClick={() => {
                                    getContent(modelValue)
                                }}/>
                        </div>
                    </div>
                </>
                :
                ''
            }
        </>
})
const EditorSkeleton = () => {
    return <div className={style.editor_skeleton}>
                <div className={style.editor_top}>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width='100%' height='3rem' />
                    </div>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width='100%' height='3rem' />
                    </div>
                </div>
                <Skeleton variant="rounded" width='100%' height='11rem' />
                <div className={style.editor_bottom}>
                    <Skeleton variant="rounded" width='3.4rem' height='1.8rem' />
                </div>
            </div>
}
export default Tinymce