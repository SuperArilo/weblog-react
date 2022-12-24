import React, { useState, useEffect, useCallback } from 'react'
//样式
import style from '../assets/scss/components/gossipContent.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
//组件
import Avatar from '../components/Avatar'
import WaterWave from 'water-wave'
//方法
export default class GossipContent extends React.Component {
    render() {
        return (
            <div className={style.gossip_box}>
                <header className={style.gossip_box_title}>
                    <div className={style.left_info}>
                        <Avatar width='2.8rem' height='2.8rem' src={this.props.data.avatar}/>
                        <div className={style.info_content}>
                            <div>
                                <span>{this.props.data.nickName}</span>
                                <span>{this.props.data.createTime}</span>
                            </div>
                            <span></span>
                        </div>
                    </div>
                    <div className={style.right_function}>
                        <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                        <i className='fas fa-ellipsis-v' />
                    </div>
                </header>
                <div className={`${style.gossip_render_content} ${renderHtml.render_html}`} dangerouslySetInnerHTML={{ __html: this.props.data.content}} />
                <div className={style.gossip_state}>
                    <span>{this.props.data.likes} 个喜欢</span>
                    <span>|</span>
                    <span>{this.props.data.comments} 条评论</span>
                </div>
                <div className={style.gossip_button}>
                    <button type='button'>
                        <i className='fas fa-heart' />
                        喜欢
                        <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                    </button>
                    <button type='button'>
                        <i className='fas fa-comment-dots' />
                        评论
                        <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                    </button>
                    <button type='button'>
                        <i className='fas fa-share-alt' />
                        分享
                        <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                    </button>
                </div>
            </div>
        )
    }
}