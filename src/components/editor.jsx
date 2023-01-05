import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
//样式
import style from '../assets/scss/components/editor.module.scss'
//组件
import AsukaButton from './asukaButton'
import Avatar from './Avatar'
import Skeleton from '@mui/material/Skeleton'
//方法
import { customUploadImage } from '../util/upload'

export default class Tinymce extends React.Component {
    state = {
        tinymce: null,
        modelValue: null,
        initialValue: null,
        config: {
            height: 200,
            skin: 'oxide',
            placeholder: this.props.placeholder,
            content_css: 'fabric',
            menubar: false,
            branding: false,
            language_url: "/tinymce/langs/zh-Hans.js",
            language: "zh-Hans",
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'insertdatetime', 'media', 'table', 'help'
            ],
            toolbar: [
                { name: 'styles', items: [ 'styles' ] },
                { name: 'formatting', items: [ 'bold', 'italic', 'forecolor', 'image'] },
                { name: 'alignment', items: [ 'alignleft', 'aligncenter', 'alignright', 'alignjustify' ] },
                { name: 'indentation', items: [ 'bullist', 'numlist', 'outdent', 'indent', 'table' ] },
                { name: 'history', items: [ 'undo', 'redo' ] }
            ],
            toolbar_mode: 'sliding',
            content_style: 'body { font-size:14px }',
            setup: (editor) => {
                setTimeout(() => {
                    this.setState({ tinymce: editor })
                }, 1000)
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
        this.state.tinymce.setContent('')
        this.setState({ modelValue: '' })
    }s
    render() {
        return (
            <>
                { this.state.tinymce ? '':<EditorSkeleton /> }
                <div className={style.editor_tinymce} style={{ display: this.state.tinymce ? 'block':'none' }}>
                    <Editor tinymceScriptSrc={ process.env.PUBLIC_URL + '/tinymce/tinymce.min.js' } initialValue={this.state.initialValue} init={this.state.config} onChange={(event, editor) => { this.setState({ modelValue: editor.getContent() }) }} />
                    <div className={style.editor_bottom}>
                        <div className={style.left_user_info}>
                        </div>
                        <AsukaButton text='提交' status={this.props.status} onClick={() => { this.props.getContent(this.state.modelValue) }}/>
                    </div>
                </div>
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
                <Skeleton variant="rounded" width='100%' height='8.1rem' />
                <div className={style.editor_bottom}>
                    <Skeleton variant="rounded" width='4rem' height='1.8rem' />
                </div>
            </div>
        )
    }
}