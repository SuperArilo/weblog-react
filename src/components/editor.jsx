import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
//样式
import style from '../assets/scss/components/editor.module.scss'
//组件
import AsukaButton from './asukaButton'
import Skeleton from '@mui/material/Skeleton'
//方法
import { customUploadImage } from '../util/upload'

export default class Tinymce extends React.Component {
    state = {
        tinymce: null,
        modelValue: null,
        initialValue: null,
        config: {
            height: 260,
            skin: 'oxide',
            placeholder: this.props.placeholder,
            content_css: 'default',
            menubar: false,
            branding: false,
			statusbar: true,
            language_url: "/tinymce/langs/zh-Hans.js",
            language: "zh-Hans",
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'insertdatetime', 'media', 'table', 'help'
            ],
            toolbar: [
                { name: 'styles', items: [ 'styles', 'fontsize', 'image' ] },
                { name: 'formatting', items: [ 'forecolor', 'bold', 'italic', 'lineheight', 'removeformat', 'hr'] },
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
            setup: (editor) => {
                setTimeout(() => {
                    this.setState({ tinymce: editor })
                }, 600)
            },
            images_upload_handler: (blobInfo, success) => new Promise((resolve, reject) => {
                let data = new FormData()
                data.append('file', blobInfo.blob())
                customUploadImage(data).then(resq => {
                    if(resq.code === 200) {
                        resolve(resq.data)
                    } else {
                        reject(resq.message)
                    }
                }).catch(err => {
                    reject(err.message)
                })
            })
        }
    }
    clear() {
        this.setState({ modelValue: '' }, () => {
            this.state.tinymce.setContent('')
        })
    }
    render() {
        return (
            <>
                {
                    this.props.userInfo !== null ?
                    <>
                        { this.state.tinymce ? '':<EditorSkeleton /> }
                        <div className={style.editor_tinymce} style={{ display: this.state.tinymce ? 'flex':'none' }}>
                            <Editor 
                                tinymceScriptSrc={ process.env.PUBLIC_URL + '/tinymce/tinymce.min.js' }
                                initialValue={this.state.initialValue} init={this.state.config}
                                onChange={(event, editor) => {
                                    this.setState({ modelValue: editor.getContent() })
                                }} />
                            <div className={style.editor_bottom}>
                                <div className={style.left_user_info}>
                                </div>
                                <AsukaButton
                                    text='提交'
                                    onClick={() => {
                                        this.props.getContent(this.state.modelValue)
                                    }}/>
                            </div>
                        </div>
                    </>
                    :
                    ''
                }
            </>   
        )
    }
}
class EditorSkeleton extends React.Component {
    render() {
        return (
            <div className={style.editor_skeleton}>
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
        )
    }
}