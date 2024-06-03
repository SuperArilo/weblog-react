import Slide from '@mui/material/Slide'
import WaterWave from './WaterWave'
import { CSSTransition } from 'react-transition-group'
import style from '../assets/scss/createWindow.module.scss'
import Svg from 'react-inlinesvg'
import { useRef } from 'react'
export default function CreateWindow({ status = false, onClose = () => null, width, children }) {
    const ref = useRef(null)
    return (
        <CSSTransition in={status} timeout={300} classNames="mask-fade" nodeRef={ref} mountOnEnter={true} unmountOnExit={true}>
            <div ref={ref} className={style.function_mask}>
                <Slide direction="up" in={status} mountOnEnter unmountOnExit>
                    <div className={style.create_window}>
                        <div className={style.window_header} onClick={() => { onClose(false) }}>
                            <Svg
                                width='1.5rem'
                                height='1.5rem'
                                src='https://image.superarilo.icu/svg/back.svg'/>
                                <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
                        </div>
                        <div style={{ width: width }}>
                            {children}
                        </div>
                    </div>
                </Slide>
            </div>
        </CSSTransition>
    )
}