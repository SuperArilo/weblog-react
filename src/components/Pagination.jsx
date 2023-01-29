import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
//组件
import ReactPaginate from 'react-paginate'
//样式
import style from '../assets/scss/components/pagination.module.scss'
export default function Pagination(props) {
    return (
        <div className={style.pagination}>
            <ReactPaginate
                pageClassName={style.pagination_item}
                activeClassName={style.pagination_item_selected}
                previousClassName={style.pagination_item_previous}
                nextClassName={style.pagination_item_next}
                breakLinkClassName={style.pagination_item_break}
                breakLabel={<i className='fas fa-ellipsis-h' />}
                previousLabel={<i className='fas fa-angle-left' />}
                nextLabel={<i className='fas fa-angle-right' />}
                onPageChange={(e) => { props.onPageChange(e.selected + 1) }}
                pageRangeDisplayed={props.pageRangeDisplayed}
                pageCount={props.pages}
                marginPagesDisplayed={0}
                renderOnZeroPageCount={null}
                forcePage={props.current}
            />
        </div>
    )
}
Pagination.defaultProps = {
    pages: 1,
    current: 0,
    pageRangeDisplayed: 3,
    onPageChange: (e) => {
        return e.selected + 1 || null
    }
}