import React from 'react'
import { useSelector } from 'react-redux'
//样式
import style from './GossipSkeleton.module.scss'
import ThemeStyle from './GossipSkeleton.Theme.module.scss'
//组件
import Skeleton from '@mui/material/Skeleton'

export default function GossipSkeleton({ viewUid = null }) {
    //theme
	const isDark = useSelector(state => state.theme.isDark)

    return (
        <div className={`${style.gossip_skeleton_list} ${isDark ? ThemeStyle.dark_gossip_skeleton_list:ThemeStyle.light_gossip_skeleton_list}`}>
            <GossipSkeletonItem />
            {
                viewUid === null &&
                <>
                    <GossipSkeletonItem />
                    <GossipSkeletonItem />
                </>
            }
        </div>
    )
}
const GossipSkeletonItem = () => {
    return (
        <div className={`${style.gossip_skeleton} ${ThemeStyle.gossip_skeleton} `}>
                <div className={style.gossip_skeleton_top}>
                    <Skeleton variant="circular" width='2.8rem' height='2.8rem' />
                    <div className={style.gossip_skeleton_info}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width='8rem' height='2rem' />
                        <Skeleton variant="text" sx={{ fontSize: '0.5rem' }} width='4rem' height='2rem' />
                    </div>
                </div>
                <Skeleton variant="rounded" width='100%' height='3rem' />
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} width='6rem' height='2rem' />
                <div className={style.gossip_skeleton_bottom}>
                    <div>
                        <Skeleton variant="rounded" width='100%' height='2rem' />
                    </div>
                    <div>
                        <Skeleton variant="rounded" width='100%' height='2rem' />
                    </div>
                    <div>
                        <Skeleton variant="rounded" width='100%' height='2rem' />
                    </div>
                </div>
            </div>
    )
}