import { useCallback, useEffect, useRef } from "react"
import style from '../assets/scss/components/waterWave.module.scss'
export default function WaterWave(props) {

    const instanceRef = useRef(null)
    const clickFunc = useCallback(e => {
        let x = e.clientX - instanceRef.current.getBoundingClientRect().left
        let y = e.clientY - instanceRef.current.getBoundingClientRect().top
        let ripples = document.createElement('span')
        ripples.style.top = y + 'px'
        ripples.style.left = x + 'px'
        ripples.style.backgroundColor = props.color
        ripples.style.animationName = style.wave_animate
        ripples.style.animationDuration = `${props.duration}s`
        ripples.style.animationTimingFunction = 'linear'
        ripples.style.animationIterationCount = 'infinite'
        ripples.className = style.wave_btn
        instanceRef.current.appendChild(ripples)
        setTimeout(() => {
            ripples.remove()
        }, props.duration * 1000)
    }, [props.color, props.duration])

    useEffect(() => {
        const instance = instanceRef.current
        instance.parentElement.style.position = props.position
        instance.parentElement.addEventListener('click',  clickFunc)
        return () => {
            if(instance.parentElement == null) return
            instance.parentElement.removeEventListener('click', clickFunc)
        }
    }, [clickFunc, props.position])

    return <aside className={style.wave_aside} ref={instanceRef}/>
}
WaterWave.defaultProps = {
    color: 'rgba(0, 0, 0, 0.7)',
    duration: 1,
    position: 'relative'
}