//组件
import Paginations from '@mui/material/Pagination'
//样式
import style from './Pagination.module.scss'
export default function Pagination({ page = 0, count = 0, position = 'center', onPageChange = () => null }) {

    return (
        <div className={style.pagination} style={{ justifyContent: position === 'center' ? 'center':position === 'left' ? 'flex-start':position === 'right' ? 'flex-end':'center' }}>
            <Paginations
                count={count}
                page={page}
                color="primary"
                size='small'
                onChange={(event, num) => onPageChange(num)}/>
        </div>
    )
}