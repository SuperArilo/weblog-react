import Slide from '@mui/material/Slide'
import WaterWave from './WaterWave'
import { useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import style from './CreateWindow.module.scss'
import ThemeStyle from './CreateWindow.Theme.module.scss'
import Svg from '../components/Svg'
import { useRef } from 'react'
export default function CreateWindow({ status = false, onClose = () => null, width, children }) {

    //theme
    const isDark = useSelector(state => state.theme.isDark)

    const ref = useRef(null)
    return (
        <CSSTransition in={status} timeout={300} classNames="mask-fade" nodeRef={ref} mountOnEnter={true} unmountOnExit={true}>
            <div ref={ref} className={`${style.function_mask} ${isDark ? ThemeStyle.dark_mask:ThemeStyle.light_mask}`}>
                <Slide direction="up" in={status} mountOnEnter unmountOnExit>
                    <div className={`${style.create_window} ${ThemeStyle.create_window}`}>
                        <div className={style.window_header} onClick={() => { onClose(false) }}>
                            <Svg
                                style={{
                                    width: '1.5rem',
                                    height: '1.5rem'
                                }}
                                name='Back'/>
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