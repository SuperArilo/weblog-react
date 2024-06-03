import { forwardRef, useImperativeHandle, useRef } from 'react'

//组件
import AvatarEditor from 'react-avatar-editor'
//样式
import style from '../assets/scss/components/avatarCut.module.scss'

const AvatarCut = forwardRef(({ image }, ref) => {

    const avatarEditorRef = useRef(null)

    useImperativeHandle(ref, () => ({
        getImage: () => {
            return avatarEditorRef
        }
    }))

    return (
        <AvatarEditor
            className={style.avatar_cut}
            ref={avatarEditorRef}
            image={image}
            width={120}
            height={120}
            border={0}
            color={[0, 0, 0, 0.4]}
            scale={1}
            borderRadius={100}
            rotate={0}
            />
    )
})
export default AvatarCut