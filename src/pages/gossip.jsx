import React, { useState, useEffect, useCallback } from 'react'
//样式
import style from '../assets/scss/gossip.module.scss'
//组件
import Avatar from '../components/Avatar'
//方法
import { gossipList } from '../util/gossip'
import customTips from '../util/notostack/customTips'
export default class Gossip extends React.Component {
    state = {
        requestInstance: {
            pageNum: 1,
            pageSize: 10
        },
        gossipList: []
    }
    componentDidMount() {
        gossipList(this.state.requestInstance).then(resq => {
            if(resq.code === 200) {
                console.log(resq.data)
                this.setState({ gossipList: resq.data.list })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }
    render() {
        return (
            <div className={style.gossip_page}>
                {
                    this.state.gossipList.map(item => {
                        return (
                            <div key={item.id} className={style.gossip_box}>
                                <header className={style.gossip_box_title}>
                                    <Avatar src={item.avatar}/>
                                </header>
                            </div>
                        )
                    })
                }
                
            </div>
        )
    }
}