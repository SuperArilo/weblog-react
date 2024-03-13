import React, { useState, useEffect, useCallback, useRef } from 'react'
import AsukaButton from './components/asukaButton'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import signStyle from './assets/scss/sign.module.scss'
//hook
import { Route, Routes, useLocation, useNavigate, Navigate  } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
//axios
import { blogLoginUser, blogRegisterUser, blogUserLoginOut } from './util/user'
import { regiserMail, findPassword } from './util/mail/mail'
import { userCreateGossip } from './util/gossip'

//组件
import Svg from 'react-inlinesvg'
import toast from 'react-hot-toast'
import WaterWave from './components/WaterWave'
import Slide from '@mui/material/Slide'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArticleDetail from './pages/articleDetail'
import Gossip from './pages/gossip'
import IndexPage from './pages/index'
import $ from 'jquery'
import Avatar from './components/Avatar'
import About from './components/About'
import Guestbook from './pages/Guestbook'
import Links from './pages/Links'
import Friends from './pages/Friends'
import NotFound from './pages/NotFound'
import User from './pages/User'
import VerifyEmailPage from './pages/VerifyEmailPage'
import FindPassword from './pages/FindPassword'
import CreateWindow from './components/CreateWindow'
import Notice from './pages/notice'
import Icon from './components/Icon'
import Tinymce from './components/editor'
//样式
import './assets/scss/currencyTransition.scss'
import './assets/css/emojiBox.css'
//小东西
import 'sakana-widget/lib/index.css'
import SakanaWidget from 'sakana-widget'


import NoticeSocket from './pages/NoticeSocket'
export default function App () {
	//hook
	const location = useLocation()
	const isMobileStatus = useSelector((state) => state.isMobile.status)
	const dispatch = useDispatch()
	const userInfo = useSelector((state) => state.userInfo.info)
	//param
	const [loginBoxStatus, setLoginBoxStatus] = useState(false)
	const [registerBoxStatus, setRegisterBoxStatus] = useState(false)
	const [createGossip, setCreateGossip] = useState(false)
	//创建碎语请求状态
	const [gossipInstance, setGossipInstance] = useState({
        status: false,
    })
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
			blogLoginUser({ data: null, toast: null }).then(resq => {
				if(resq.code === 200) {
					loginSetUserInfo(resq.data.user)
				} else {
					localStorage.removeItem('token')
				}
			}).catch(err => { })
		}
	}, [loginSetUserInfo])

	useEffect(() => {
		if(userInfo !== null) {
			$('#react-by-asukamis').css({ 'backgroundImage': 'url(' + userInfo.background + ')' })
		} else {
			$('#react-by-asukamis').css({ 'backgroundImage': 'url(https://image.superarilo.icu/defalut_bg.jpg)' })
		}
	}, [userInfo])

	useEffect(() => {
		new SakanaWidget().mount('#sakana-widget')
	}, [])

	return (
		<>
			<div className='render-content'>
				{
					isMobileStatus ? 
					<MobileHeaderNav
						userInfo={userInfo}
						setCreateGossip={setCreateGossip}
						openLoginBox={(status) => {
							setLoginBoxStatus(status)
						}} />
					:
					<PCheaderNav
						userInfo={userInfo}
						setCreateGossip={setCreateGossip}
						openLoginBox={e => {
							setLoginBoxStatus(e)
						}}/>
				}
				<div className={`${'router-render'} ${isMobileStatus ? 'router-render-mobile':''}`}>
					<SwitchTransition mode="out-in">
						<CSSTransition key={location.pathname} timeout={300} classNames="change" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
							<Routes location={location}>
								<Route index path='/' element={<IndexPage isMobile={ isMobileStatus } userInfo={userInfo} />} />
								<Route path='/detail' element={<ArticleDetail userInfo={userInfo} />} />
								<Route path='/gossip' element={<Gossip userInfo={userInfo}/>} />
								<Route path='/guestbook' element={<Guestbook />} />
								<Route path='/user/:viewUid' element={<User />} />
								<Route path='/user/verify' element={<VerifyEmailPage />} />
								<Route path='/user/find-password' element={<FindPassword />} />
								<Route path='/notice' element={<Notice />} />
								<Route path='/links' element={<Links />} />
								<Route path='/friends' element={<Friends /> } />
								<Route path='/notfound' element={<NotFound /> } />
								<Route path='/error' element={<NotFound /> } />
								<Route path='*' element={<Navigate to='/notfound' />} />
							</Routes>
						</CSSTransition>
					</SwitchTransition>
				</div>
				<About />
				<CreateWindow width={isMobileStatus ? '100%':'24rem'} status={loginBoxStatus} onClose={status => { setTimeout(() => { setLoginBoxStatus(status) }, 500) }}>
					<LoginBox
						status={loginBoxStatus}
						openRegisterBox={(e) => {setRegisterBoxStatus(e)}}
						closeBox={(e) => {setLoginBoxStatus(e)}} />
				</CreateWindow>
				<CreateWindow width={isMobileStatus ? '100%':'24rem'} status={registerBoxStatus} onClose={status => { setTimeout(() => { setRegisterBoxStatus(status) }, 500) }}>
					<RegisterBox
						status={registerBoxStatus}
						isMobile={isMobileStatus}
						openLoginBox={(e) => { setLoginBoxStatus(e) }}
						closeBox={(e) => {setRegisterBoxStatus(e)}} />
				</CreateWindow>
				<CreateWindow width={isMobileStatus ? '100%':'24rem'} status={createGossip} onClose={status => { setTimeout(() => { setCreateGossip(status) }, 500) }}>
					<p className={signStyle.window_header_p}>发表碎语</p>
					<Tinymce
						userInfo={userInfo}
						placeholder='在这里输入内容哦'
						getContent={content => {
							if(!gossipInstance.status) {
								if(content === '<p></p>' || content === null || content === '') {
									toast('内容不能为空哦！')
									return
								}
								setGossipInstance({...gossipInstance, status: true})
								let data = new FormData()
								data.append('content', content)
								userCreateGossip({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
									if(resq.code === 200) {
										setCreateGossip(false)
									}
									setGossipInstance({...gossipInstance, status: false})
								}).catch(err => {
									setGossipInstance({...gossipInstance, status: false})
									props.setCreateWindowStatus(false)
								})
							}
						}}/>
				</CreateWindow>
			</div>
			<div id='sakana-widget'></div>
			{
				(localStorage.getItem('token') && userInfo !== null) && <NoticeSocket token={localStorage.getItem('token')} />
			}
			
		</>
	)
}
const PCheaderNav = (props) => {
	//hook
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	//param
	const navInstance = useRef(null)
	const [menuInstance, setMenuInstance] = useState({
		index: 0,
		list: [
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
		]
	})

	const [userNavInstance, setUserNavInstance] = useState({
		popperStatus: false,
		popperTarget: null,
		myMenuList:[
			{
				id: 0,
				title: '我的账号',
				iconClass: 'avatar'
			},
			{
				id: 1,
				title: '发表碎语',
				iconClass: 'gossip'
			},
			{
				id: 2,
				title: '设置',
				iconClass: 'setting'
			},
			{
				id: 3,
				title: '退出',
				iconClass: 'signout',
				function: () => {
					dispatch({ type: 'userInfo/setInfo', payload: null })
					localStorage.removeItem('token')
				}
			}
		]
	})

	const pushNotice = useSelector((state) => state.pushNotice.instance)
	const [noticeCount, setNoticeCount] = useState(0)
	//路由变化匹配
	useEffect(() => {
		let index = menuInstance.list.findIndex(item => item.path === location.pathname)
		if(index === -1) {
			index = null
			setMenuInstance(target => ({
				...target,
				index: null
			}))
			return
		}
		setMenuInstance(target => ({
			...target,
			index: target.list[index].id
		}))
	}, [location.pathname, menuInstance.list])

	useEffect(() => {
		$('#react-by-asukamis').off().on('scroll', e => {
			if($(e.target).scrollTop() >= $(navInstance.current).height()) {
				$(navInstance.current).removeClass('header-nav-default').addClass('header-nav-overflow')
			} else {
				$(navInstance.current).removeClass('header-nav-overflow').addClass('header-nav-default')
			}
		})
	}, [])

	useEffect(() => {
		if(pushNotice.length === 0) {
			setNoticeCount(0)
			return
		}
		pushNotice.forEach((e, i) => {
			setNoticeCount(n => n + e.count)
		})
	}, [pushNotice, setNoticeCount])

	return (
		<nav className='header-nav header-nav-default' ref={navInstance}>
			<span className='left-webside-icon' onClick={() => { navigate('/') }}>
				Arilo
				<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
			</span>
			<ul className='nav-menu-list'>
				{
					menuInstance.list.map(item => {
						return <li
								className={menuInstance.index === item.id ? 'active':''}
								onClick={() => {
									if(menuInstance.index === item.id) return
									navigate(item.path)
									$('#react-by-asukamis').stop().animate({'scrollTop': 0})
								}}
								key={item.id}>
									{item.title}
								</li>
					})
				}
			</ul>
			<div className='right-some-function'>
				{
					props.userInfo === null ? 
					<AsukaButton text='登录' onClick={() => { props.openLoginBox(true) }}/>
					:
					<div className='logged-box'>
						<Icon
							src='https://image.superarilo.icu/svg/notice.svg'
							width='1.5rem'
							height='1.5rem'
							count={noticeCount === 0 ? '':noticeCount}
							onClick={() => { navigate('/notice') }}/>
						<Avatar
							src={props.userInfo.avatar}
							title={props.userInfo.nickName}
							alt={props.userInfo.nickName}
							onClick={(e) => {
								setUserNavInstance({...userNavInstance, popperStatus: true, popperTarget: e.target})
							}}/>
						<Menu
							anchorEl={userNavInstance.popperTarget}
							open={userNavInstance.popperStatus}
							autoFocus={false}
							onClose={() => { setUserNavInstance({...userNavInstance, popperStatus: false}) }}>
							<MenuItem
								disableGutters={false}
								onClick={() => {
									navigate(`/user/${props.userInfo.uid}`)
									setUserNavInstance({...userNavInstance, popperStatus: false, popperTarget: null})
								}}>
								<Svg
									cacheRequests={true}
									src='https://image.superarilo.icu/svg/avatar.svg'
									width='1.3rem'
									height='1.2rem'/>
								<span className='menu_font'>
									我的账号
								</span>
							</MenuItem>
							<MenuItem
								disableGutters={false}
								onClick={() => {
									props.setCreateGossip(true)
									setUserNavInstance({...userNavInstance, popperStatus: false, popperTarget: null})
								}}>
								<Svg
									cacheRequests={true}
									src='https://image.superarilo.icu/svg/gossip.svg'
									width='1.3rem'
									height='1.3rem'/>
								<span className='menu_font'>
									发表碎语
								</span>
							</MenuItem>
							<MenuItem
								disableGutters={false}
								onClick={() => {
									navigate(`/user/${props.userInfo.uid}`)
									setUserNavInstance({...userNavInstance, popperStatus: false, popperTarget: null})
								}}>
								<Svg
									cacheRequests={true}
									src='https://image.superarilo.icu/svg/setting.svg'
									width='1.3rem'
									height='1rem'/>
								<span className='menu_font'>
									设置
								</span>
							</MenuItem>
							<MenuItem
								disableGutters={false}
								onClick={() => {
									setUserNavInstance({...userNavInstance, popperStatus: false, popperTarget: null})
									blogUserLoginOut({ data: null, toast: { isShow: true, loadingMessage: '退出中...' } }).then(resq => {
										if(resq.code === 200) {
											dispatch({ type: 'userInfo/setInfo', payload: null })
											localStorage.removeItem('token')
										}
									}).catch(() => {})
								}}>
								<Svg
									cacheRequests={true}
									src='https://image.superarilo.icu/svg/signout.svg'
									width='1.3rem'
									height='1rem'/>
								<span className='menu_font'>
									退出
								</span>
							</MenuItem>
						</Menu>
					</div>
				}
			</div>
		</nav>
	)
}
const MobileHeaderNav = (props) => {
	//hook
	const navigate = useNavigate()
	const dispatch = useDispatch()
	//param
	const [drawerStatus, setDrawerStatus] = useState(false)
	const [menuList] = useState([
		{
			id: 0,
			title: '首页',
			path: '/',
			svgSrc: 'https://image.superarilo.icu/svg/home.svg'
		},
		{
			id: 1,
			title: '碎语',
			path: '/gossip',
			svgSrc: 'https://image.superarilo.icu/svg/gossip.svg'
		},
		{
			id: 2,
			title: '留言',
			path: '/guestbook',
			svgSrc: 'https://image.superarilo.icu/svg/guestbook.svg'
		},
		{
			id: 3,
			title: '友邻',
			path: '/links',
			svgSrc: 'https://image.superarilo.icu/svg/link.svg'
		},
		{
			id: 4,
			title: '圈子',
			path: '/friends',
			svgSrc: 'https://image.superarilo.icu/svg/friend.svg'
		}
	])
	return (
		<>
			<nav className='mobile-header-nav'>
				<div className='left-mobile-bar'>
					{
						props.userInfo !== null &&
						<>
							<Icon
								width='2rem'
								height='2rem'
								src='https://image.superarilo.icu/svg/gossip.svg'
								onClick={() => { props.setCreateGossip(true) }}/>
							<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
						</>
					}
				</div>
				<span className='left-webside-icon'>Arilo</span>
				<div className='right-mobile-bar' onClick={() => { setDrawerStatus(true) }}>
					<Svg
						cacheRequests={true}
						src='https://image.superarilo.icu/svg/menu.svg'
						width='1.5rem'
						height='1.5rem'/>
					<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
				</div>
			</nav>
			<CSSTransition in={drawerStatus} timeout={300} classNames="mask-fade" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
				<div
					className={signStyle.function_mask}
					functionkey='mask'
					onClick={(e) => { 
						if(e.target.attributes.functionkey) {
							setDrawerStatus(false)
						} else {
							e.stopPropagation()
						}
					}}>
					<Slide direction="right" in={drawerStatus} mountOnEnter unmountOnExit>
						<div className={signStyle.slide_box}>
							<header className={signStyle.header_function}>
								{
									props.userInfo != null &&
									<Icon
										width='2rem'
										height='2rem'
										src='https://image.superarilo.icu/svg/notice.svg'
										onClick={() => {
											navigate('/notice')
											setTimeout(() => {
												setDrawerStatus(false)
											}, 500)
										}}/>
								}
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
												<Svg
													cacheRequests={true}
													src={item.svgSrc}
													width='1.5rem'
													height='1.5rem'/>
												<span>{item.title}</span>
												<WaterWave color='rgba(255, 255, 255, 0.7)' duration={ 1 } />
											</li>
										)
									})
								}
							</ul>
							<div className={signStyle.slide_bottom_function}>
								{
									props.userInfo ?
									<>
										<div 
											className={signStyle.function_box}
											onClick={() => {
												setTimeout(() => {
													navigate(`/user/${props.userInfo.uid}`)
													setDrawerStatus(false)
												}, 500)
											}}>
											<Svg
												cacheRequests={true}
												src='https://image.superarilo.icu/svg/setting.svg'
												width='1.1rem'
												height='1.1rem'/>
											<span>设置</span>
											<WaterWave color="rgba(255, 255, 255, 0.7)" duration={ 1 } />
										</div>
										<div 
											className={signStyle.function_box}
											onClick={() => {
												blogUserLoginOut({ data: null, toast: { isShow: true, loadingMessage: '退出中...' } }).then(resq => {
													if(resq.code === 200) {
														dispatch({ type: 'userInfo/setInfo', payload: null })
														localStorage.removeItem('token')
													}
												}).catch(() => {})
											}}>
											<Svg
												cacheRequests={true}
												src='https://image.superarilo.icu/svg/signout.svg'
												width='1.1rem'
												height='1.1rem'/>
											<span>注销</span>
											<WaterWave color="rgba(255, 255, 255, 0.7)" duration={ 1 } />
										</div>
									</>
									:
									<AsukaButton text='登录' size='big' onClick={() => { props.openLoginBox(true) }} />
								}
								
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

	const [requestInstance, setRequestInstance] = useState({
		email: '',
		password: ''
	})
	const [authenticationCode, setAuthenticationCode] = useState('')


	//验证码随机数，点击刷新判断
	const [random, setRandom] = useState(Math.random())
	const [isShowPassword, setIsShowPassword] = useState(false)
	const [emailMatchRule] = useState(/^(\w+([-.][A-Za-z0-9]+)*){3,18}@\w+([-.][A-Za-z0-9]+)*\.\w+([-.][A-Za-z0-9]+)*$/)
	const [loginStatus, setLoginStatus] = useState(false)
	const loginFunction = () => {
		if(userInfo !== null) {
			toast('你已经登陆过了！')
			return
		}
		if(!loginStatus) {
			if(requestInstance.email === null || requestInstance.email === '' || requestInstance.password === null || requestInstance.password === '') {
				toast('输入的内容不能为空哦')
				return
			}
			if(!emailMatchRule.test(requestInstance.email)) {
				toast('输入的邮箱格式不正确')
				return
			}
			setLoginStatus(true)
			blogLoginUser({ data: requestInstance, toast: { isShow: true, loadingMessage: '登录中...' } }, { 'Authentication-Code': authenticationCode, 'Authentication-Type': 'Login' }).then(resq => {
				if(resq.code === 200) {
					localStorage.setItem('token', resq.data.token)
					dispatch({ type: 'userInfo/setInfo', payload: resq.data.user })
					setTimeout(() => { props.closeBox(false) }, 1000)
				} else {
					setRandom(Math.random())
				}
				setAuthenticationCode('')
				setLoginStatus(false)
			}).catch(err => {
				setRandom(Math.random())
				setAuthenticationCode('')
				setLoginStatus(false)
			})
		}
	}

	return (
		<div className={`${signStyle.login_box} ${isMobileStatus? signStyle.box_mobile:signStyle.box_pc}`}>
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
			<form className={signStyle.input_list}>
				<label className={signStyle.input_item}>
					<div className={signStyle.input_top_div}>
						<span>邮箱</span>
						<span>*</span>
					</div>
					<input
						type="text"
						name='LoginEmail'
						placeholder="请输入邮箱"
						onChange={(e) => {
							setRequestInstance({
								...requestInstance,
								email: e.target.value
							})
						}} />
					<div className={signStyle.input_tips_div}>
						<span></span>
					</div>
				</label>
				<label className={signStyle.input_password}>
					<div className={signStyle.input_top_div}>
						<span>密码</span>
						<span>*</span>
					</div>
					<div className={signStyle.input_password_label}>
						<input name='LoginPassword' type={isShowPassword ? 'text':'password'} maxLength="16" placeholder="请输入密码" autoComplete="off" onChange={(e) => { setRequestInstance({ ...requestInstance, password: e.target.value }) }} />
						<div className={signStyle.input_show_password} onClick={() => { setIsShowPassword(!isShowPassword) }}>
							<Svg
								width='1.5rem'
								height='1.5rem'
								src={`https://image.superarilo.icu/svg/${isShowPassword ? 'password_hide':'password_show'}.svg`} />
						</div>
					</div>
					<div className={signStyle.input_tips_div}>
						<span></span>
					</div>
				</label>
			</form>
			<div className={signStyle.find_password_box}>
				<div className={signStyle.captcha_box}>
					{
						emailMatchRule.test(requestInstance.email) && 
						<>
							<img
								src={`${window.location.protocol}//${window.location.hostname}/api/captcha/image?type=login&random=${random}`}
								title='点击刷新'
								alt='verify code'
								onClick={() => {
									setRandom(Math.random())
								}}/>
							<input
								name='verifyCode'
								type="text"
								maxLength={4}
								value={authenticationCode}
								onChange={e => {
									setAuthenticationCode(e.target.value)
								}} />
						</>
					}
				</div>
				<span onClick={() => {
					if(requestInstance.email === '' || requestInstance.email === null) {
						toast('输入邮箱后再点击此处哦')
						return
					}
					if(!emailMatchRule.test(requestInstance.email)) {
						toast('输入的邮箱格式不正确')
						return
					}
					findPassword({ data: { email: requestInstance.email }, toast: { isShow: true, loadingMessage: '操作中...' } }).then(resq => {}).catch(err => {})
				}}>忘记密码...</span>
			</div>
			<button type="button" title="登录" className={signStyle.confirm_button + ' ' + (isMobileStatus ? signStyle.confirm_button_mobile:signStyle.confirm_button_pc)} onClick={() => { loginFunction() }}>
				{ !loginStatus && userInfo === null ? '登录':'' }
				{ loginStatus ? <Svg width='1.5rem' height='1.5rem' className='rotate' src='https://image.superarilo.icu/svg/loading.svg' /> : '' }
				{ userInfo !== null && !loginStatus ? <Svg width='1.5rem' height='1.5rem' src='https://image.superarilo.icu/svg/success.svg' /> : '' }
				<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
			</button>
		</div>
	)
}
const RegisterBox = (props) => {

	const [isShowPassword, setIsShowPassword] = useState(false)
	const [againPassword, setAgainPassword] = useState({
		show: false,
		content: ''
	})

	const [inputInstance, setInputInstance] = useState({
		email: '',
		password: '',
		nickName: '',
		verifyCode: ''
	})
	const [requestStatus, setRequestStatus] = useState({
		registerStatus: false,
		sendMailStatus: false,
		countDown: 60
	})
	const intervalID = useRef(null)

	return(
		<Slide direction="up" in={props.status} mountOnEnter unmountOnExit>
			<div className={`${signStyle.register_box} ${props.isMobile ? signStyle.box_mobile:signStyle.box_pc}`}>
				<div className={signStyle.top_tips}>
					<span className={signStyle.left_span}>欢迎您,</span>
					<button type="button" className={signStyle.right_register} onClick={() => { 
						props.openLoginBox(true)
						props.closeBox(false)
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
						<input name='RegisterEmail' type="text" placeholder="请输入邮箱" onChange={e => { setInputInstance({...inputInstance, email: e.target.value}) }} />
						<div className={signStyle.input_tips_div}>
							<span></span>
						</div>
					</label>
					<label className={signStyle.input_item}>
						<div className={signStyle.input_top_div}>
							<span>验证码</span>
							<span>*</span>
						</div>
						<div className={signStyle.custom_email_style}>
							<input
								name='RegisterEmailCode'
								type="text"
								value={inputInstance.verifyCode}
								placeholder="验证码"
								onChange={e => {
									setInputInstance({...inputInstance, verifyCode: e.target.value.replaceAll(' ', '')})
								}} />
							<button
								type='button'
								onClick={() => {
									if(!requestStatus.sendMailStatus && requestStatus.countDown === 60) {
										setRequestStatus({...requestStatus, sendMailStatus: true})
										if(inputInstance.email === '' || inputInstance.email === null) {
											toast('邮箱不能为空哦')
											setRequestStatus({...requestStatus, sendMailStatus: false})
											return
										}
										let data = new FormData()
										data.append('mail', inputInstance.email)
										regiserMail({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
											if(resq.code === 200) {
												setRequestStatus({...requestStatus, sendMailStatus: false})
												intervalID.current = setInterval(() => {
													if(requestStatus.countDown === 0) {
														setRequestStatus({...requestStatus, countDown: 60})
														clearInterval(intervalID.current)
														intervalID.current = null
														return
													}
													setRequestStatus({...requestStatus, countDown: requestStatus.countDown--})
												}, 1000)
											} else if(resq.code === 0) {
												setRequestStatus({...requestStatus, sendMailStatus: false})
											} else {
												setRequestStatus({...requestStatus, sendMailStatus: false})
											}
										}).catch(err => {
											setRequestStatus({...requestStatus, sendMailStatus: false})
										})
									}
									
								}}>
									{
										(requestStatus.countDown === 60 && !requestStatus.sendMailStatus) && '获取验证码'
									}
									{
										requestStatus.sendMailStatus && <Svg width='1.5rem' height='1.5rem' className='rotate' src='https://image.superarilo.icu/svg/loading.svg' />
									}
									{
										requestStatus.countDown < 60 && requestStatus.countDown
									}
									<WaterWave color='rgb(228, 177, 177)' duration={ 1 } />
								</button>
						</div>
					</label>
					<form className={signStyle.input_password}>
						<div className={signStyle.input_top_div}>
							<span>密码</span>
							<span>*</span>
						</div>
						<div className={signStyle.input_password_label}>
							<input
								name='RegisterPassword'
								type={isShowPassword ? 'text':'password'}
								maxLength="16"
								placeholder="请输入密码"
								autoComplete="off"
								onChange={e => {
									setInputInstance({...inputInstance, password: e.target.value})
								}} />
							<div className={signStyle.input_show_password} onClick={() => { setIsShowPassword(!isShowPassword) }}>
								<Svg
									width='1.5rem'
									height='1.5rem'
									src={`https://image.superarilo.icu/svg/${isShowPassword ? 'password_hide':'password_show'}.svg`} />
							</div>
							
						</div>
						<div className={signStyle.input_tips_div}>
							<span></span>
						</div>
					</form>
					<form className={signStyle.input_password}>
						<div className={signStyle.input_top_div}>
							<span>确认</span>
							<span>*</span>
						</div>
						<div className={signStyle.input_password_label}>
							<input
								name='RegisterPasswordAgain'
								type={againPassword.show ? 'text':'password'}
								maxLength="16"
								placeholder="请输入确认密码"
								autoComplete="off"
								onChange={e => {
									setAgainPassword({...againPassword, content: e.target.value})
								}} />
							<div className={signStyle.input_show_password} onClick={() => { setAgainPassword({...againPassword, show: !againPassword.show}) }}>
								<Svg
									width='1.5rem'
									height='1.5rem'
									src={`https://image.superarilo.icu/svg/${againPassword.show ? 'password_hide':'password_show'}.svg`} />
							</div>
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
						<input
							name='RegisterNickName'
							type="text"
							placeholder="请输入昵称"
							onChange={e => {
								setInputInstance({...inputInstance, nickName: e.target.value})
							}} />
						<div className={signStyle.input_tips_div}>
							<span></span>
						</div>
					</label>
				</div>
				<button 
					type="button"
					title="注册"
					className={`${signStyle.confirm_button} ${props.isMobile ? signStyle.confirm_button_mobile:signStyle.confirm_button_pc}`}
					onClick={() => {
						if(inputInstance.email === '' || inputInstance.password === '' || inputInstance.nickName === '' || inputInstance.verifyCode === '') return toast('信息没有填写完整哦 v(/▽＼)')
						if(inputInstance.password !== againPassword.content) {
							toast('两次输入的密码不一致，请检查')
							return
						}
						if(!requestStatus.registerStatus) {
							setRequestStatus({...requestStatus, registerStatus: true})
							let data = new FormData()
							data.append('email', inputInstance.email)
							data.append('password', inputInstance.password)
							data.append('nickName', inputInstance.nickName)
							data.append('verifyCode', inputInstance.verifyCode)
							blogRegisterUser({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
								if(resq.code === 200) {
									setTimeout(() => {
										clearInterval(intervalID.current)
										intervalID.current = null
										props.openLoginBox(true)
										props.closeBox(false)
									}, 500)
								}
								setRequestStatus({...requestStatus, registerStatus: false})
							}).catch(err => {
								setRequestStatus({...requestStatus, registerStatus: false})
							})
						}
					}}>
					{
						requestStatus.registerStatus ? <Svg width='1.5rem' height='1.5rem' className='rotate' src='https://image.superarilo.icu/svg/loading.svg' />:'注册'
					}
					<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
				</button>
			</div>
		</Slide>
	)
}