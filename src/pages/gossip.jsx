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
import { likeGossip } from '../util/gossip.js'
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
                                        <GossipContent
                                            userInfo={this.props.userInfo} 
                                            data={item}
                                            handleLike={(gossipId) => {
                                                let data = new FormData()
                                                data.append('gossipId', gossipId)
                                                likeGossip(data).then(resq => {
                                                    if(resq.code === 200) {
                                                        customTips.success(resq.message)
                                                        let temp = [...this.state.gossipList]
                                                        let index = temp.findIndex(item => item.id === gossipId)
                                                        if(resq.data.status) {
                                                            temp[index].likes++
                                                        } else {
                                                            if(temp[index].likes >= 0) {
                                                                temp[index].likes--
                                                            }
                                                        }
                                                        temp[index].isLike = resq.data.status
                                                        this.setState({ gossipList: temp })
                                                    } else {
                                                        customTips.error(reqs.message)
                                                    }
                                                }).catch(err => {
                                                    customTips.error(err.message)
                                                })
                                            }}/>
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