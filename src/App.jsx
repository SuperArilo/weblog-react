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
//axios login register
import { blogLoginUser } from './util/user'
import customTips from './util/notostack/customTips'
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
	const loginSetUserInfo = useCallback((value) => {
		dispatch({ type: 'userInfo/setInfo', payload: value })
	}, [dispatch])
	useEffect(() => {
		let token = localStorage.getItem('token')
		if(token) {
			blogLoginUser().then(resq => {
				if(resq.code === 200) {
					loginSetUserInfo(resq.data.user)
				} else {
					localStorage.removeItem('token')
				}
			})
		}
	}, [loginSetUserInfo])
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
					<LoginBox status={loginBoxStatus} openRegisterBox={(e) => {setRegisterBoxStatus(e)}} closeBox={(e) => {setLoginBoxStatus(e)}} />
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
	//hook
	const dispatch = useDispatch()
	const userInfo = useSelector((state) => state.userInfo.info)

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
				{ userInfo === null ? <AsukaButton text='登录' onClick={() => { props.openLoginBox(true) }}/>:
					<img className='user-head' src={userInfo.avatar} title={userInfo.nickName} alt={userInfo.nickName} /> 
				}
				
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
const LoginBox = (props) => {
	//hook
	const isMobileStatus = useSelector((state) => state.isMobile.status)
	const dispatch = useDispatch()
	//用户信息
	const userInfo = useSelector((state) => state.userInfo.info)

	const [isShowPassword, setIsShowPassword] = useState(false)
	const [emailAndUID, setEmailAndUID] = useState(null)
	const [password, setPassword] = useState(null)
	const [emailMatchRule] = useState(/^(\w+([-.][A-Za-z0-9]+)*){3,18}@\w+([-.][A-Za-z0-9]+)*\.\w+([-.][A-Za-z0-9]+)*$/)
	const [loginStatus, setLoginStatus] = useState(false)
	const loginFunction = () => {
		if(userInfo !== null) {
			customTips.warning('你已经登陆过了！')
			return
		}
		if(!loginStatus) {
			setLoginStatus(true)
			let data = new FormData()
			if(emailMatchRule.test(emailAndUID)) {
				data.append('email', emailAndUID)
			} else {
				data.append('uid', emailAndUID)
			}
			data.append('password', password)
			setTimeout(() => {
				blogLoginUser(data).then(resq => {
					if(resq.code === 200) {
						localStorage.setItem('token', resq.data.token)
						dispatch({ type: 'userInfo/setInfo', payload: resq.data.user })
						customTips.success(resq.message)
						setTimeout(() => { props.closeBox(false) }, 1000)
					} else {
						customTips.error(resq.message)
					}
					setLoginStatus(false)
				}).catch(err => {
					customTips.error(err.message)
					setLoginStatus(false)
				})
			}, 2000)
		}
	}
	return (
		<Slide direction="up" in={props.status} mountOnEnter unmountOnExit>
				<div className={signStyle.login_box + ' ' + (isMobileStatus? signStyle.box_mobile:signStyle.box_pc)}>
					<header className={signStyle.public_title}>
						<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
						<i className="far fa-arrow-alt-circle-left" onClick={() => { setTimeout(() => {props.closeBox(false)}, 300) }}/>
					</header>
					<div className={signStyle.top_tips}>
						<span className={signStyle.left_span}>欢迎回来,</span>
						<button type="button" className={signStyle.right_register} onClick={() => {
							props.openRegisterBox(true)
							props.closeBox(false)
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
							<input type="text" placeholder="请输入邮箱或者UID" onChange={(e) => { setEmailAndUID(e.target.value) }} />
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
								<input type={isShowPassword ? 'text':'password'} maxLength="16" placeholder="请输入密码" autoComplete="off" onChange={(e) => { setPassword(e.target.value) }} />
								<i className={'far ' + signStyle.input_show_password + ' ' + (isShowPassword ? 'fa-eye-slash':'fa-eye')} onClick={() => { setIsShowPassword(!isShowPassword) }} />
							</div>
							<div className={signStyle.input_tips_div}>
								<span></span>
							</div>
						</form>
					</div>
					<button type="button" title="登录" className={signStyle.confirm_button + ' ' + (isMobileStatus ? signStyle.confirm_button_mobile:signStyle.confirm_button_pc)} onClick={() => { loginFunction() }}>
						{ !loginStatus && userInfo === null ? '登陆':'' }
						{ loginStatus ? <i className='fas fa-circle-notch fa-spin' />:'' }
						{ userInfo !== null && !loginStatus ? <i className='fas fa-check' style={{ 'color': '#80e298' }} />:''}
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