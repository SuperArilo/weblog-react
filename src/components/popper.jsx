//组件
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import AsukaButton from './asukaButton'
//样式
import style from '../assets/scss/components/popper.module.scss'
const AsukaPopper = (props) => {
    return (
        <Popper
            open={props.open}
            anchorEl={props.target}
            placement={props.placement}
            transition
            style={{zIndex: 10}}>
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <div className={style.popper_box}>
                        <p>{props.title}</p>
                        <div>
                            <AsukaButton text='确定' size='small' onClick={ () => props.onConfirm() } />
                            <AsukaButton text='取消' class='danger' size='small' onClick={ () => props.onCancel() }/>
                        </div>
                    </div>
                </Fade>
            )}
        </Popper>
    )
}
AsukaPopper.defaultProps = {
    title: '未设置',
    open: false,
    status: false,
    placement: 'bottom',
    target: null
}
export default AsukaPopper