import React, { useState, useEffect, useCallback } from 'react'
import AsukaButton from './components/asukaButton'
import { Route, Routes, useLocation, useNavigate  } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import IndexPage from './pages/index'
import ArticleDetail from './pages/articleDetail'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import signStyle from './assets/scss/sign.module.scss'
import $ from 'jquery'
import WaterWave from 'water-wave'
import Slide from '@mui/material/Slide'
const App = () => {
	const [loginBoxStatus, setLoginBoxStatus] = useState(false)
	const [registerBoxStatus, setRegisterBoxStatus] = useState(false)
	const location = useLocation()
	const isMobileStatus = useSelector((state) => state.isMobile.status)
	const dispatch = useDispatch()
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
			{ isMobileStatus ? <MobileHeaderNav />:<PCheaderNav openLoginBox={e => { setLoginBoxStatus(e) }}/> }
			<div className='router-render'>
				<SwitchTransition mode="out-in">
					<CSSTransition key={location.pathname} timeout={300} classNames="fade" nodeRef={null}>
						<Routes location={location}>
							<Route path='/' element={<IndexPage isMobile={ isMobileStatus }/>} />
							<Route path='/detail/:articleId' element={<ArticleDetail />} />
						</Routes>
					</CSSTransition>
				</SwitchTransition>
			</div>
			<CSSTransition in={loginBoxStatus} timeout={300} classNames="box-fade" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
				<div className={signStyle.funtion_mask}>
					<LoginBox status={loginBoxStatus} isMobile={isMobileStatus} openRegisterBox={(e) => {setRegisterBoxStatus(e)}} closeBox={(e) => {setLoginBoxStatus(e)}} />
				</div>
			</CSSTransition>
			<CSSTransition in={registerBoxStatus} timeout={300} classNames="box-fade" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
				<div className={signStyle.funtion_mask}>
					<RegisterBox status={registerBoxStatus} isMobile={isMobileStatus} openLoginBox={(e) => { setLoginBoxStatus(e) }} closeBox={(e) => {setRegisterBoxStatus(e)}} />
				</div>
			</CSSTransition>
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
			<span className='left-webside-icon' onClick={goToMainPage}>
				Asukamis
				<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
			</span>
			<ul className='nav-menu-list'>
				{
					menuList.map(item => {
						return <li className={menuIndex === item.id ? 'active':''} onClick={() => { menuNavFunction(item) }} key={item.id}>{item.title}</li>
					})
				}
			</ul>
			<div className='right-some-function'>
				<AsukaButton text='登录' onClick={() => { props.openLoginBox(true) }}/>
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
				<i className="fas fa-bars"/>
				<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
			</div>
		</nav>
	)
}
class LoginBox extends React.Component {
	state = {
		isShowPassword: false
	}
	render() {
		return(
			<Slide direction="up" in={this.props.status} mountOnEnter unmountOnExit>
				<div className={signStyle.login_box + ' ' + (this.props.isMobile ? signStyle.box_mobile:signStyle.box_pc)}>
					<header className={signStyle.public_title}>
						<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
						<i className="far fa-arrow-alt-circle-left" onClick={() => { setTimeout(() => {this.props.closeBox(false)}, 300) }}/>
					</header>
					<div className={signStyle.top_tips}>
						<span className={signStyle.left_span}>欢迎回来,</span>
						<button type="button" className={signStyle.right_register} onClick={() => {
							this.props.openRegisterBox(true)
							this.props.closeBox(false)
						}}>
							注册
						</button>
					</div>
					<p className={signStyle.top_tips_line}>请填写以下信息进行登录</p>
					<div className={signStyle.input_list}>
						<label className={signStyle.input_item}>
							<div className={signStyle.input_top_div}>
								<span>邮箱 / UID</span>
								<span>*</span>
							</div>
							<input type="text" placeholder="请输入邮箱或者UID" />
							<div className={signStyle.input_tips_div}>
								<span></span>
							</div>
						</label>
						<form className={signStyle.input_password}>
							<div className={signStyle.input_top_div}>
								<span>密码</span>
								<span>*</span>
							</div>
							<div className={signStyle.input_password_label}>
								<input type={true ? 'text':'password'} maxLength="16" placeholder="请输入密码" autoComplete="off" />
								<i className={'far ' + signStyle.input_show_password + ' ' + (this.state.isShowPassword? 'fa-eye-slash':'fa-eye')} onClick={() => { this.setState({ isShowPassword: !this.state.isShowPassword }) }} />
							</div>
							<div className={signStyle.input_tips_div}>
								<span></span>
							</div>
						</form>
					</div>
					<button type="button" title="登录" className={signStyle.confirm_button + ' ' + (this.props.isMobile ? signStyle.confirm_button_mobile:signStyle.confirm_button_pc)} >
						登陆
						<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
					</button>
					<span className={signStyle.other_login_tips}>其他登录方式</span>
					<div className={signStyle.other_login_list}>
						<i className="fab fa-qq"/>
						<i className="fab fa-github"/>
						<i className="fab fa-google"/>
						<i className="fab fa-xbox"/>
					</div>
				</div>
			</Slide>
		)
	}
}
class RegisterBox extends React.Component {
	state = {
		isShowPassword: false
	}
	render(){
		return(
			<Slide direction="up" in={this.props.status} mountOnEnter unmountOnExit>
				<div className={signStyle.register_box + ' ' + (this.props.isMobile ? signStyle.box_mobile:signStyle.box_pc)}>
					<header className={signStyle.public_title}>
						<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
						<i className="far fa-arrow-alt-circle-left" onClick={() => { setTimeout(() => {this.props.closeBox(false)}, 300) }}/>
					</header>
					<div className={signStyle.top_tips}>
						<span className={signStyle.left_span}>欢迎您,</span>
						<button type="button" className={signStyle.right_register} onClick={() => { 
							this.props.openLoginBox(true)
							this.props.closeBox(false)
						}}>
							登陆
						</button>
					</div>
					<p className={signStyle.top_tips_line}>请填写以下信息进行注册</p>
					<div className={signStyle.input_list}>
						<label className={signStyle.input_item}>
							<div className={signStyle.input_top_div}>
								<span>邮箱</span>
								<span>*</span>
							</div>
							<input type="text" placeholder="请输入邮箱" />
							<div className={signStyle.input_tips_div}>
								<span></span>
							</div>
						</label>
						<form className={signStyle.input_password}>
							<div className={signStyle.input_top_div}>
								<span>密码</span>
								<span>*</span>
							</div>
							<div className={signStyle.input_password_label}>
								<input type={true ? 'text':'password'} maxLength="16" placeholder="请输入密码" autoComplete="off" />
								<i className={'far ' + signStyle.input_show_password + ' ' + (this.state.isShowPassword? 'fa-eye-slash':'fa-eye')} onClick={() => { this.setState({ isShowPassword: !this.state.isShowPassword }) }} />
							</div>
							<div className={signStyle.input_tips_div}>
								<span></span>
							</div>
						</form>
						<label className={signStyle.input_item}>
							<div className={signStyle.input_top_div}>
								<span>昵称</span>
								<span>*</span>
							</div>
							<input type="text" placeholder="请输入昵称" />
							<div className={signStyle.input_tips_div}>
								<span></span>
							</div>
						</label>
					</div>
					<button type="button" title="注册" className={signStyle.confirm_button + ' ' + (this.props.isMobile ? signStyle.confirm_button_mobile:signStyle.confirm_button_pc)} >
						注册
						<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
					</button>
				</div>
			</Slide>
		)
	}
}
export default App