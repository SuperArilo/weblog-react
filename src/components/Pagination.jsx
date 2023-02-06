import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
//组件
import Paginations from "react-js-pagination"
//样式
import style from '../assets/scss/components/pagination.module.scss'
export default function Pagination(props) {

    return (
        <div className={style.pagination}>
            <Paginations
                itemClass={style.pagination_item}
                activeClass={style.pagination_item_selected}
                activeLinkClass={style.pagination_item_selected_link}
                prevPageText={<i className='fas fa-angle-left' />}
                nextPageText={<i className='fas fa-angle-right' />}
                activePage={props.current}
                itemsCountPerPage={10}
                totalItemsCount={props.total}
                pageRangeDisplayed={props.pageRangeDisplayed}
                hideFirstLastPages={true}
                onChange={e => { props.onPageChange(e) }}/>
        </div>
    )
}
Pagination.defaultProps = {
    total: 0,
    current: 0,
    pageRangeDisplayed: 3,
    onPageChange: (e) => {
        return null
    }
}