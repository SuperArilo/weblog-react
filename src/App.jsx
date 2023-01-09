import React, { useState, useEffect, useCallback } from 'react'
import AsukaButton from './components/asukaButton'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import signStyle from './assets/scss/sign.module.scss'
//hook
import { Route, Routes, useLocation, useNavigate  } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
//axios
import { blogLoginUser } from './util/user'
//组件
import customTips from './util/notostack/customTips'
import WaterWave from 'water-wave'
import Slide from '@mui/material/Slide'
import ArticleDetail from './pages/articleDetail'
import Gossip from './pages/gossip'
import IndexPage from './pages/index'
import $ from 'jquery'
import Avatar from './components/Avatar'
import About from './components/About'
import AsukaPopper from './components/popper'
//样式
import './assets/scss/currencyTransition.scss'

const App = () => {
	//hook
	const location = useLocation()
	const isMobileStatus = useSelector((state) => state.isMobile.status)
	const dispatch = useDispatch()
	const userInfo = useSelector((state) => state.userInfo.info)
	//param
	const [loginBoxStatus, setLoginBoxStatus] = useState(false)
	const [registerBoxStatus, setRegisterBoxStatus] = useState(false)
	//function
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
			{ isMobileStatus ? <MobileHeaderNav userInfo={userInfo} openLoginBox={(status) => { setLoginBoxStatus(status) }} />:<PCheaderNav userInfo={userInfo} openLoginBox={e => { setLoginBoxStatus(e) }}/> }
			<div className={`${'router-render'} ${isMobileStatus ? 'router-render-mobile':''}`}>
				<SwitchTransition mode="out-in">
					<CSSTransition key={location.pathname} timeout={300} classNames="change" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
						<Routes location={location}>
							<Route path='/' element={<IndexPage isMobile={ isMobileStatus }/>} />
							<Route path='/detail' element={<ArticleDetail userInfo={userInfo} isMobile={ isMobileStatus } />} />
							<Route path='/gossip' element={<Gossip userInfo={userInfo}/>} />
						</Routes>
					</CSSTransition>
				</SwitchTransition>
			</div>
			<About />
			<CSSTransition in={loginBoxStatus} timeout={300} classNames="mask-fade" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
				<div className={signStyle.funtion_mask}>
					<LoginBox status={loginBoxStatus} openRegisterBox={(e) => {setRegisterBoxStatus(e)}} closeBox={(e) => {setLoginBoxStatus(e)}} />
				</div>
			</CSSTransition>
			<CSSTransition in={registerBoxStatus} timeout={300} classNames="mask-fade" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
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
	const navigate = useNavigate()
	const location = useLocation()
	//param
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
			path: '/gossip',
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
	const [popperStatus, setPopperStatus] = useState(false)
	const [popperTarget, setPopperTarget] =useState(null)
	//function
	//路由变化匹配
	useEffect(() => {
		let index = menuList.findIndex(item => item.path === location.pathname)
		if(index === -1) {
			index = 0
		}
		setMenuIndex(menuList[index].id)
	}, [location.pathname, menuList])

	const menuNavFunction = (object) => {
		if(menuIndex === object.id) return
		navigate(object.path, { replace: true, state: { id : '666' } })
		$('#react-by-asukamis').children().stop().animate({'scrollTop': 0})
	}
	return (
		<nav className='header-nav'>
			<span className='left-webside-icon' onClick={() => { navigate('/') }}>
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
				{ props.userInfo === null ? <AsukaButton text='登录' onClick={() => { props.openLoginBox(true) }}/>:
					<div className='logged-box'>
						<Avatar src={props.userInfo.avatar} title={props.userInfo.nickName} alt={props.userInfo.nickName}/>
						<i className='fas fa-sign-out-alt' onClick={(e) => { setPopperStatus(true);setPopperTarget(e.target) }}/>
						<AsukaPopper open={popperStatus} title='确定要退出登陆吗？' target={popperTarget} placement='bottom' onConfirm={() => { setPopperStatus(false);dispatch({ type: 'userInfo/setInfo', payload: null });localStorage.removeItem('token') }} onCancel={() => { setPopperStatus(false) }} />
					</div>
				}
			</div>
		</nav>
	)
}
const MobileHeaderNav = (props) => {
	//hook
	const navigate = useNavigate()
	const location = useLocation()
	//param
	const [drawerStatus, setDrawerStatus] = useState(false)
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
			path: '/gossip',
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
	return (
		<>
			<nav className='mobile-header-nav'>
				<div className='left-empty-div' />
				<span className='left-webside-icon'>Asukamis</span>
				<div className='right-mobile-bar' onClick={() => { setDrawerStatus(true) }}>
					<i className="fas fa-bars"/>
					<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
				</div>
			</nav>
			<CSSTransition in={drawerStatus} timeout={300} classNames="mask-fade" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
				<div className={signStyle.funtion_mask} functionkey='mask' onClick={(e) => { 
					if(e.target.attributes.functionkey) {
						setDrawerStatus(false)
					} else {
						e.stopPropagation()
					}
				 }}>
					<Slide direction="right" in={drawerStatus} mountOnEnter unmountOnExit>
						<div className={signStyle.slide_box}>
							<header className={signStyle.header_function}>
								<i className='fas fa-bell' />
								<i className='fas fa-sign-out-alt' />
							</header>
							<div className={signStyle.user_info_box}>
								<img src={props.userInfo ? props.userInfo.avatar:''} alt={props.userInfo ? props.userInfo.nickName:''} title={props.userInfo ? props.userInfo.nickName:''} />
								<p>{props.userInfo ? props.userInfo.nickName:'未登录'}</p>
							</div>
							<ul className={signStyle.slide_center_menu}>
								{
									menuList.map(item => {
										return (
											<li key={item.id} onClick={() => { 
												navigate(item.path)
												setTimeout(() => {
													setDrawerStatus(false)
												}, 500)
											 }}>
												<i className={`${'fas'} ${item.iconClass}`} />
												<span>{item.title}</span>
												<WaterWave color='rgba(255, 255, 255, 0.7)' duration={ 500 } />
											</li>
										)
									})
								}
							</ul>
							<div className={signStyle.slide_bottom_function}>
								<AsukaButton text='登录' size='big' onClick={() => { props.openLoginBox(true) }} />
							</div>
						</div>
					</Slide>
				</div>
			</CSSTransition>
		</>
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
			if(emailAndUID === null || emailAndUID === '' || password === null || password === '') {
				customTips.info('输入的内容不能为空哦')
				return
			}
			setLoginStatus(true)
			let data = new FormData()
			if(emailMatchRule.test(emailAndUID)) {
				data.append('email', emailAndUID)
			} else {
				data.append('uid', emailAndUID)
			}
			data.append('password', password)
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
		}
	}
	return (
		<Slide direction="up" in={props.status} mountOnEnter unmountOnExit>
			<div className={`${signStyle.login_box} ${isMobileStatus? signStyle.box_mobile:signStyle.box_pc}`}>
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
				<div className={`${signStyle.register_box} ${this.props.isMobile ? signStyle.box_mobile:signStyle.box_pc}`}>
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