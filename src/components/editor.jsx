import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
export default class Tiinymce extends React.Component {
    state = {
        editorRef: null,
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
                { name: 'history', items: [ 'undo', 'redo', 'blocks' ] },
                { name: 'styles', items: [ 'styles' ] },
                { name: 'formatting', items: [ 'bold', 'italic', 'forecolor', 'image'] },
                { name: 'alignment', items: [ 'alignleft', 'aligncenter', 'alignright', 'alignjustify' ] },
                { name: 'indentation', items: [ 'bullist', 'numlist', 'outdent', 'indent' ] }
            ],
            toolbar_mode: 'sliding',
            content_style: 'body { font-size:14px }',
            images_upload_handler: (blobInfo, success) => {
                return new Promise((resolve, reject) => {
                    
                })
            }
        }
    }
    log = () => {
        console.log(this.state.editorRef)
    }
    render(){
        return (
            <div>
                <Editor
                    tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                    onInit={(evt, editor) => this.setState({editorRef: editor})}
                    initialValue='<p>This is the initial content of the editor.</p>'
                    init={this.state.config}
                />
                <button onClick={this.log}>Log editor content</button>
            </div>
        )
    }
}