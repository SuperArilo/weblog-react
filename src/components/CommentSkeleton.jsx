import React from 'react'
//样式
import style from '../assets/scss/components/commentSkeleton.module.scss'
//组件
import Skeleton from '@mui/material/Skeleton'
export default class CommentSkeleton extends React.Component {
    render() {
        return(
            <div className={style.empty_skeleton}>
                <div className={style.skeleton_top}>
                    <Skeleton variant="circular" width='2.5rem' height='2.5rem' />
                    <div className={style.skeleton_info}>
                        <Skeleton variant="text" width='5rem' sx={{ fontSize: '1.2rem' }} />
                        <Skeleton variant="text" width='3rem' sx={{ fontSize: '1.2rem' }} />
                    </div>
                </div>
                <Skeleton variant="rounded" height='3rem' />
            </div>
        )
    }
}