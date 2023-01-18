import React, { useState, useEffect, useCallback } from 'react'
import style from '../assets/scss/notFound.module.scss'
export default function NotFound(props){
    return (
        <div className={style.not_found}>
            404 Not Found
        </div>
    )
}