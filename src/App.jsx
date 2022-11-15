import React, { useState, useEffect } from 'react'
import AsukaButton from './components/asukaButton'
import { Route, Routes } from 'react-router-dom'
import IndexPage from './pages/index'
import ArticleDetail from './pages/articleDetail'
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import './assets/scss/Animate.scss'
import $ from 'jquery'
const App = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const goToMainPage = () => {
		navigate('/')
	}
	return (
		<div className='render-content'>
			<nav className='header-nav'>
				<span className='left-webside-icon' onClick={goToMainPage}>Asukamis</span>
				<HeaderNavList />
				<div className='right-some-function'>
					<AsukaButton text='登录' />
				</div>
			</nav>
			<div className='router-render'>
			<Routes location={location}>
				<Route path='/' element={<IndexPage />} />
				<Route path='/detail/:articleId' element={<ArticleDetail />} />
			</Routes>
			</div>
		</div>
	)
}
const HeaderNavList = () => {
	const [menuIndex, setMenuIndex] = useState(0)
	const [menuList] = useState([
		{
			id: 0,
			title: '首页',
			path: '/',
			iconClass: 'fa-home'
		},
		{
			id: 1,
			title: '碎语',
			path: '/say',
			iconClass: 'fa-feather-alt'
		},
		{
			id: 2,
			title: '留言',
			path: '/guestbook',
			iconClass: 'fa-comment-alt'
		},
		{
			id: 3,
			title: '友邻',
			path: '/links',
			iconClass: 'fa-user-friends'
		},
		{
			id: 4,
			title: '圈子',
			path: '/friends',
			iconClass: 'fa-paw'
		}
	])
	const navigate = useNavigate()
	const menuNavFunction = (object) => {
		if(menuIndex === object.id) return
		setMenuIndex(object.id)
		navigate(object.path)
		console.log($('#react-by-asukamis'))
		$('#react-by-asukamis').stop().animate({'scrollTop': 0})
	}
	return (
		<ul className='nav-menu-list'>
			{
				menuList.map(item => {
					return <li className={menuIndex === item.id ? 'active':''} onClick={() => { menuNavFunction(item) }} key={item.id}>{item.title}</li>
				})
			}
		</ul>
	)
}
export default App