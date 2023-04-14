import React, { useState, useEffect, useCallback, useRef } from 'react'
import 'react-photo-view/dist/react-photo-view.css'
import $ from 'jquery'
import { PhotoSlider } from 'react-photo-view'
export default function PreviewImage(props) {

    const [previewInstance, setPreviewInstance] = useState({
        visible: false,
        list: [],
        index: 0,
    })

    useEffect(() => {
        if(props.current.current !== null && previewInstance.list.length === 0) {
            $(props.current.current).find('img').each((index, item) => {
                setPreviewInstance(target => {
                    return {
                        ...target,
                        list: [...target.list, { src: $(item).attr('src'), key: index }]
                    }
                })
            })
        }
    }, [props, previewInstance.list.length])

    useEffect(() => {
        if(props.current.current !== null) {
            $(props.current.current).off('click').on('click', e => {
                if(e.target.localName === 'img') {
                    setPreviewInstance(target => {
                        return {
                            ...target,
                            visible: !target.visible,
                            index: target.list.findIndex(item => item.src === $(e.target).attr('src'))
                        }
                    })
                }
            })
        }
    }, [props])

    return (
        <PhotoSlider
            images={previewInstance.list}
            visible={previewInstance.visible}
            onClose={() => {
                setPreviewInstance({ ...previewInstance, visible: false })
            }}
            index={previewInstance.index}
            onIndexChange={(index, state) => {
                setPreviewInstance(target => {
                    return {
                        ...target,
                        index: index
                    }
                })
            }}
            />
    )
}
PreviewImage.defaultProps = {
    current: null
}