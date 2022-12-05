import React, { useState, useEffect, useCallback } from 'react'
import AsukaButton from './components/asukaButton'
import { Route, Routes, useLocation, useNavigate  } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import IndexPage from './pages/index'
import ArticleDetail from './pages/articleDetail'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import signStyle from './assets/scss/sign.module.scss'
import $ from 'jquery'
import DehazeIcon from '@mui/icons-material/Dehaze'
import WaterWave from 'water-wave'
import Slide from '@mui/material/Slide'
const App = () => {
	const location = useLocation()
	const isMobileStatus = useSelector((state) => state)
	const dispatch = useDispatch()
	const [loginBoxStatus, setLoginBoxStatus] = useState(false)
	const checkIsMobile = useCallback((value) => {
		dispatch({ type: 'isMobile/setStatus', payload: value < 1080 })
	}, [dispatch])
	useEffect(() => {
		checkIsMobile(window.innerWidth)
		window.addEventListener('resize', (e) => {
			checkIsMobile(e.target.innerWidth)
		})
	}, [checkIsMobile])
	return (
		<div className='render-content'>
			{ isMobileStatus.isMobile.status ? <MobileHeaderNav />:<PCheaderNav loginBoxStatus={(status) => {setLoginBoxStatus(status)}} /> }
			<div className='router-render'>
				<SwitchTransition mode="out-in">
					<CSSTransition key={location.pathname} timeout={300} classNames="fade" nodeRef={null}>
						<Routes location={location}>
							<Route path='/' element={<IndexPage isMobile={ isMobileStatus.isMobile.status }/>} />
							<Route path='/detail/:articleId' element={<ArticleDetail />} />
						</Routes>
					</CSSTransition>
				</SwitchTransition>
			</div>
			{ loginBoxStatus ? <LoginBox status={loginBoxStatus}/>:'' }
		</div>
	)
}
const PCheaderNav = (props) => {
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
		$('#react-by-asukamis').stop().animate({'scrollTop': 0})
	}
	const goToMainPage = () => {
		navigate('/')
	}
	return (
		<nav className='header-nav'>
			<span className='left-webside-icon' onClick={goToMainPage}>Asukamis</span>
			<ul className='nav-menu-list'>
				{
					menuList.map(item => {
						return <li className={menuIndex === item.id ? 'active':''} onClick={() => { menuNavFunction(item) }} key={item.id}>{item.title}</li>
					})
				}
			</ul>
			<div className='right-some-function'>
				<AsukaButton text='登录' onClick={() => {props.loginBoxStatus(true)}} />
			</div>
		</nav>
	)
}
const MobileHeaderNav = () => {
	return (
		<nav className='mobile-header-nav'>
			<div className='left-empty-div' />
			<span className='left-webside-icon'>Asukamis</span>
			<div className='right-mobile-bar'>
				<DehazeIcon />
				<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
			</div>
		</nav>
	)
}
class LoginBox extends React.Component {
	componentDidMount(){
		console.log(this)
	}
	render() {
		return (
			<div className={signStyle.funtion_mask}>
				<Slide direction="up" in={this.props.status} mountOnEnter unmountOnExit>
					<div className={signStyle.login_box}></div>
				</Slide>
			</div>
		)
	}
}
export default App