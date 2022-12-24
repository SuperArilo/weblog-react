import React, { useState, useEffect, useCallback } from 'react'
//样式
import style from '../assets/scss/gossip.module.scss'
//组件
import { TransitionGroup } from 'react-transition-group'
import Collapse from '@mui/material/Collapse'
import GossipContent from '../components/gossipContent'
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
                    <TransitionGroup>
                        {
                            this.state.gossipList.map(item => {
                                return (
                                    <Collapse key={item.id}>
                                        <GossipContent data={item}/>
                                    </Collapse>
                                )
                            })
                        }
                    </TransitionGroup>
                }
                
            </div>
        )
    }
}