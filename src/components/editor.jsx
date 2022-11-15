import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
export default class Tinymce extends React.Component {
    state = {
        modelValue: null,
        initialValue: null,
        config: {
            height: 200,
            skin: 'oxide',
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
            images_upload_handler: (blobInfo, success) => {
                return new Promise((resolve, reject) => {
                    
                })
            }
        }
    }
    render(){
        return (
            <Editor tinymceScriptSrc={ process.env.PUBLIC_URL + '/tinymce/tinymce.min.js' } 
            initialValue={this.state.initialValue} 
            init={this.state.config}
            onChange={(event, editor) => { this.setState({ modelValue: editor.getContent() }) }} />
        )
    }
}