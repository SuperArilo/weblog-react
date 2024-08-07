//组件
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Button from './Button'
//样式
import style from './Popper.module.scss'
const AsukaPopper = ({ title = '未设置', open = false, status = false, placement = 'bottom', target = null, onConfirm = () => null, onCancel = () => null }) => {
    return (
        <Popper
            open={open}
            anchorEl={target}
            placement={placement}
            transition
            style={{zIndex: 1301}}>
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <div className={style.popper_box}>
                        <p>{title}</p>
                        <div>
                            <Button text='确定' size='small' onClick={ () => onConfirm() } />
                            <Button text='取消' clazz='danger' size='small' onClick={ () => onCancel() }/>
                        </div>
                    </div>
                </Fade>
            )}
        </Popper>
    )
}
export default AsukaPopper