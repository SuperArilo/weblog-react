import { useEffect, useRef, useState, useCallback } from 'react'
import { RandomBetween, RandomRGB } from '../util/PublicFunction'
import { useSelector } from 'react-redux'
import { cialloListGet } from '../api/Ciallo'
import style from '../pages/Ciallo.module.scss'
import $ from 'jquery'

export default function Ciallo({ min = 300, max = 1000 }) {
    //父元素
    const content = useRef(null)
    //任务Id
    const taskId = useRef(null)
    //子元素索引
    const index = useRef(0)
    //请求对象
    const requestInstance = useRef({
        current: 1,
        size: 10
    })
    //表情包列表
    const CialloList = useRef([])
    const isMobileStatus = useSelector((state) => state.isMobile.status)
    const [renderList, setRenderList] = useState([])
    const TimeoutTask = () => {
        taskId.current = setTimeout(() => {
            StartTask()
            TimeoutTask()
        }, RandomBetween(min, max))
    }

    const renderItme = useCallback(ran => {
        return <CialloItem
                    key={index.current}
                    itemKey={index.current}
                    imagePath={CialloList.current[ran].imageUrl}
                    resource={CialloList.current[ran].audioUrl}
                    duration={RandomBetween(2000, isMobileStatus ? 10000:20000)}
                    parentInstance={content}
                    title={CialloList.current[ran].title}
                    position={RandomBetween(0, 1)}
                    end={key => setRenderList(a => a.filter(o => o.id !== key))} />
    }, [index.current, content])

    const StartTask = () => {
        if(CialloList.current.length == 0) return
        setRenderList(prevState => {
            const array = [...prevState]
            array.push({
                id: index.current,
                element: renderItme(Math.floor(Math.random() * CialloList.current.length))
            })
            index.current++
            return array
        })

    }

    useEffect(() => {
        $('#react-by-asukamis').children().css({ overflow: 'hidden' })
        cialloListGet({ data: requestInstance.current }).then(resp => {
            CialloList.current = resp.data.list
            TimeoutTask()
        }).catch(err => {  })
        return () => {
            clearTimeout(taskId.current)
            $('#react-by-asukamis').children().css({ 'overflow-y': 'scroll' })
        }
    }, [])

    return (
        <div className={style.ciallo_content} ref={content}>
            {
                renderList.map((o, i) => o.element)
            }
        </div>
    )
}
const CialloItem = ({ itemKey, imagePath, parentInstance, title, position, resource, duration = 10000, end = () => null }) => {

    const instance = useRef(null)
    const imageSize = useRef(RandomBetween(8, 14))
    const imageOrText = useRef(RandomBetween(0, 5))
    const speed = parseFloat((parentInstance.current.clientWidth / duration).toFixed(3))
    const returnRGB = () => {
        const rgb = RandomRGB()
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    }
    const returnPostionX = () => {
        const parentHeight = parentInstance.current.clientHeight
        const newTop = RandomBetween(parentInstance.current.offsetTop, parentHeight - instance.current.clientHeight)
        if(newTop >= window.innerHeight - (2 * parseInt(instance.current.clientHeight))) return { bottom: parentHeight + 10 }
        return { top: instance.current.clientHeight > newTop ? parentInstance.current.offsetTop + 10:newTop }
    }

    const [itemStyle, setItemStyle] = useState({
        opacity: 0,
        left: position ? 0:parentInstance.current.clientWidth,
        fontSize: `${RandomBetween(1, 2.5)}rem`,
        color: returnRGB()
    })
    
    const handleTransitionEnd = event => {
        if(event.propertyName === 'opacity') return
        end(itemKey)
    }
    const handleAnimationEnd = event => {
        if(event.target.localName == 'img') {
            $(event.target).attr('class', '')
        } else {
            $(event.target).attr('style', '')
        }
    }
    useEffect(() => {
        setItemStyle(i => ({
            ...i,
            ...(returnPostionX()),
            opacity: 1,
            ...(position ? { left: parentInstance.current.clientWidth }:{ left: -(instance.current.clientWidth) }),
            transition: `left ${duration}ms linear, opacity 0.25s linear`
        }))
    }, [])
    //remove EventListener
    useEffect(() => {
        const i = instance.current
        i.addEventListener('transitionend', handleTransitionEnd)
        i.addEventListener('animationend', handleAnimationEnd)
        return () => {
            i.removeEventListener('transitionend', handleTransitionEnd)
            i.removeEventListener('animationend', handleAnimationEnd)
        }
    }, [])
    return (
        <div
            ref={instance}
            onClick={() => {
                const ac = new AudioContext()
                fetch(resource).then(response => response.arrayBuffer()).then(arrayBuffer => ac.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    const a = $(instance.current).children()
                    const t = RandomBetween(0, 1)
                    if(a[0].localName === 'div') {
                        a.children().each((i, e) => {
                            setTimeout(() => {
                                $(e).css({
                                    'animation-name': t ? style.zoom:style.bounce,
                                    'animation-duration': `250ms`
                                })
                            }, 20 * i)
                        })
                    } else if(a[0].localName === 'img') {
                        $(a).addClass(style.shake)
                    }
                    const source = ac.createBufferSource()
                    source.buffer = audioBuffer
                    source.connect(ac.destination)
                    source.start(0)
                })
            }}
            onMouseOver={() => {
                setItemStyle(i => ({
                    ...i,
                    transition: null,
                    left: instance.current.offsetLeft
                }))
            }}
            onMouseLeave={() => {
                let distance = 0
                //distance 剩余距离
                if(position) {
                    distance = window.innerWidth - instance.current.offsetLeft
                } else {
                    if(instance.current.offsetLeft > 0) {
                        distance = instance.current.offsetLeft + instance.current.clientWidth
                    } else {
                        distance = instance.current.clientWidth - Math.abs(instance.current.offsetLeft)
                    }
                }
                setItemStyle(i => ({
                    ...i,
                    ...(position ? { left: parentInstance.current.clientWidth }:{ left: -(instance.current.clientWidth) }),
                    transition: `left ${(distance / speed).toFixed(0)}ms linear, opacity 0.25s linear`
                }))
            }}
            style={{
                ...itemStyle
            }}
            className={`${style.ciallo_item}`}>
            {
                imageOrText.current <= 4 ?
                <div>
                    {
                        Array.from(title).map((o, i) => <span key={i}>{ o }</span>)
                    }
                </div>
                :
                <img src={imagePath} style={{ width: `${imageSize.current}rem`, minWidth: `${imageSize.current}rem` }} />
            }
        </div>
    )
} 