import { useCallback, useEffect, useRef } from "react"
import style from './WaterWave.module.scss'
export default function WaterWave({ color = 'rgba(0, 0, 0, 0.7)', duration = 1, position = 'relative' }) {

    const instanceRef = useRef(null)
    const clickFunc = useCallback(e => {
        let x = e.clientX - instanceRef.current.getBoundingClientRect().left
        let y = e.clientY - instanceRef.current.getBoundingClientRect().top
        let ripples = document.createElement('span')
        ripples.style.top = y + 'px'
        ripples.style.left = x + 'px'
        ripples.style.backgroundColor = color
        ripples.style.animationName = style.wave_animate
        ripples.style.animationDuration = `${duration}s`
        ripples.style.animationTimingFunction = 'linear'
        ripples.style.animationIterationCount = 'infinite'
        ripples.className = style.wave_btn
        instanceRef.current.appendChild(ripples)
        setTimeout(() => {
            ripples.remove()
        }, duration * 1000)
    }, [color, duration])

    useEffect(() => {
        const instance = instanceRef.current
        instance.parentElement.style.position = position
        instance.parentElement.addEventListener('click',  clickFunc)
        return () => {
            if(instance.parentElement == null) return
            instance.parentElement.removeEventListener('click', clickFunc)
        }
    }, [clickFunc, position])

    return <aside className={style.wave_aside} ref={instanceRef}/>
}