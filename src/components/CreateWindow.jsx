import Slide from '@mui/material/Slide'
import WaterWave from './WaterWave'
import { CSSTransition } from 'react-transition-group'
import style from '../assets/scss/createWindow.module.scss'
import Svg from 'react-inlinesvg'
export default function CreateWindow(props) {
    return (
        <CSSTransition in={props.status} timeout={300} classNames="mask-fade" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
            <div className={style.function_mask}>
                <Slide direction="up" in={props.status} mountOnEnter unmountOnExit>
                    <div className={style.create_window}>
                        <div className={style.window_header} onClick={() => { props.onClose(false) }}>
                            <Svg
                                width='1.5rem'
                                height='1.5rem'
                                src='https://image.superarilo.icu/svg/back.svg'/>
                                <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
                        </div>
                        
                        <div style={{ width: props.width }}>
                            {props.children}
                        </div>
                    </div>
                </Slide>
            </div>
        </CSSTransition>
    )
}
CreateWindow.defaultProps = {
    status: false,
    onClose: () => {
        return null
    }
}