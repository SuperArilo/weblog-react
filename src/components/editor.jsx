import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
//样式
import style from '../assets/scss/components/editor.module.scss'
//组件
import AsukaButton from './asukaButton'
import Avatar from './Avatar'
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
            language_url: "/tinymce/langs/zh-Hans.js",
            language: "zh-Hans",
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
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
                this.setState({ tinymce: editor })
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
    startInit() {
        
    }
    clear() {
        this.state.tinymce.setContent('')
        this.setState({ modelValue: '' })
    }
    render() {
        return (
            <div className={style.editor_tinymce}>
                <Editor tinymceScriptSrc={ process.env.PUBLIC_URL + '/tinymce/tinymce.min.js' } initialValue={this.state.initialValue} init={this.state.config} onChange={(event, editor) => { this.setState({ modelValue: editor.getContent() }) }} />
                <div className={style.editor_bottom}>
                    <div className={style.left_user_info}>
                        <Avatar src={this.props.userInfo.avatar} title={this.props.userInfo.nickName} alt={this.props.userInfo.nickName}/>
                        <i className='fas fa-exclamation-circle'/>
                    </div>
                    <AsukaButton text='提交' status={this.props.status} onClick={() => { this.props.getContent(this.state.modelValue) }}/>
                </div>
            </div>
        )
    }
}