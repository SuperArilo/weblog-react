import Slide from '@mui/material/Slide'
import WaterWave from './WaterWave'
import { CSSTransition } from 'react-transition-group'
import style from '../assets/scss/createWindow.module.scss'
export default function CreateWindow(props) {
    return (
        <CSSTransition in={props.status} timeout={300} classNames="mask-fade" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
            <div className={style.function_mask}>
                <Slide direction="up" in={props.status} mountOnEnter unmountOnExit>
                    <div className={style.create_window}>
                        <i
                            className={`${'asukamis back'} ${style.window_header}`}
                            onClick={() => { props.onClose(false) }}>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
                        </i>
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