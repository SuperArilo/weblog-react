//组件
import Paginations from '@mui/material/Pagination'
//样式
import style from '../assets/scss/components/pagination.module.scss'
export default function Pagination(props) {

    return (
        <div className={style.pagination} style={{ justifyContent: props.position === 'center' ? 'center':props.position === 'left' ? 'flex-start':props.position === 'right' ? 'flex-end':'center' }}>
            <Paginations
                count={props.count}
                page={props.page}
                color="primary"
                size='small'
                onChange={(event, num) => props.onPageChange(num)}/>
        </div>
    )
}
Pagination.defaultProps = {
    page: 0,
    count: 0,
    position: 'center',
    onPageChange: () => {
        return null
    }
}