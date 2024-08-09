import { useEffect, useRef, useState, useCallback } from 'react'
import { RandomBetween, RandomRGB } from '../util/PublicFunction'
import { useSelector } from 'react-redux'
import { cialloListGet } from '../api/Ciallo'
import style from '../pages/Ciallo.module.scss'
import $ from 'jquery'

export default function Ciallo({ min = 100, max = 600 }) {
    //父元素
    const content = useRef(null)
    //任务Id
    const taskId = useRef(null)
    //子元素索引
    const index = useRef(0)
    //表情包列表
    const bqb = useRef([])
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
                    title={CialloList.current[ran].title} position={RandomBetween(0, 1)}
                    end={key => {
                        setRenderList(a => {
                            return a.filter(o => o.id !== key)
                        })
                    }} />
    }, [index.current, bqb.current, content])

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
        cialloListGet({ data: requestInstance.current }).then(resp => {
            CialloList.current = resp.data.list
        }).catch(err => {  })
        TimeoutTask()
        return () => clearTimeout(taskId.current)
    }, [])
    //load bqb
    useEffect(() => {
        bqb.current = Object.entries(import.meta.glob('../assets/image/yuzusoft/*.*', { eager: false }))
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
    const imageSize = useRef(RandomBetween(6, 10))
    const imageOrText = useRef(RandomBetween(0, 10))
    const returnRGB = () => {
        const rgb = RandomRGB()
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    }
    const returnPostionX = () => {
        const parentHeight = parentInstance.current.clientHeight
        const newTop = RandomBetween(parentInstance.current.offsetTop, parentHeight)
        if(newTop >= window.innerHeight - (2 * instance.current.clientHeight)) return { bottom: parentHeight }
        return { top: instance.current.clientHeight > newTop ? parentInstance.current.offsetTop:newTop }
    }

    const [itemStyle, setItemStyle] = useState({
        opacity: 0,
        ...(position ? { left: 0 }:{ right: 0 }),
        fontSize: `${RandomBetween(1, 2.5)}rem`,
        color: returnRGB()
    })
    
    const handleTransitionEnd = event => {
        if(event.propertyName === 'opacity') return
        end(itemKey)
    }
    const handleAnimationEnd = event => {
        const a = $(event.target).children()[0].localName
        switch(a) {
            case 'span':
                $(instance.current).removeClass(style.shake)
                break
            case 'img':
                $(instance.current).removeClass(style.zoom)
                break
        }
    }
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
    useEffect(() => {
        setItemStyle(i => ({
            ...i,
            ...(returnPostionX()),
            opacity: 1,
            ...(position ? { left: window.innerWidth }:{ right: window.innerWidth }),
            transition: `left ${duration}ms linear, right ${duration}ms linear, opacity 0.15s linear`
        }))
    }, [])
    return (
        <div
            ref={instance}
            onClick={e => {
                const ac = new AudioContext()
                fetch(resource).then(response => response.arrayBuffer()).then(arrayBuffer => ac.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    switch(e.target.localName) {
                        case 'span':
                            $(instance.current).addClass(style.shake)
                            break
                        case 'img':
                            $(instance.current).addClass(style.zoom)
                            break
                    }
                    const source = ac.createBufferSource()
                    source.buffer = audioBuffer
                    source.connect(ac.destination)
                    source.start(0)
                })
            }}
            onMouseOver={e => {
                setItemStyle(i => ({
                    ...i,
                    transition: null,
                    ...(position ? { left: instance.current.offsetLeft }:{ right: window.innerWidth - instance.current.offsetLeft - instance.current.clientWidth }),
                }))
            }}
            onMouseLeave={() => {
                let distance = 0
                if(position) {
                    distance = window.innerWidth - (instance.current.offsetWidth + instance.current.clientWidth)
                } else {
                    distance = window.innerWidth - instance.current.offsetLeft
                }
                setItemStyle(i => ({
                    ...i,
                    ...(position ? { left: window.innerWidth + distance }:{ right: window.innerWidth + distance }),
                    transition: `left ${duration}ms linear, right ${duration}ms linear, opacity 0.25s linear`
                }))
            }}
            style={{
                ...itemStyle
            }}
            className={`${style.ciallo_item}`}>
            {
                imageOrText.current <= 8 ?
                <span>{ title }</span>
                :
                <img src={imagePath} style={{ width: `${imageSize.current}rem`, minWidth: `${imageSize.current}rem` }} />
            }
        </div>
    )
} 