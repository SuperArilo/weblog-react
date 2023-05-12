import React, { useState, useEffect, useCallback, useRef } from 'react'
import AsukaButton from './components/asukaButton'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import signStyle from './assets/scss/sign.module.scss'
//hook
import { Route, Routes, useLocation, useNavigate, Navigate  } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
//axios
import { blogLoginUser, blogRegisterUser } from './util/user'
import { regiserMail } from './util/mail/mail'
//组件
import toast from 'react-hot-toast'
import WaterWave from 'water-wave'
import Slide from '@mui/material/Slide'
import Menu from './components/Menu'
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
import VerifyPage from './pages/VerifyPage'
import CreateGossipWindow from './components/CreateGossipWindow'
import Notice from './pages/notice'
import Icon from './components/Icon'
//样式
import './assets/scss/currencyTransition.scss'
import './assets/css/iconfont.css'

const App = () => {
	//hook
	const location = useLocation()
	const isMobileStatus = useSelector((state) => state.isMobile.status)
	const dispatch = useDispatch()
	const userInfo = useSelector((state) => state.userInfo.info)
	//param
	const [loginBoxStatus, setLoginBoxStatus] = useState(false)
	const [registerBoxStatus, setRegisterBoxStatus] = useState(false)
	const [createGossipWindowStatus, setCreateGossipWindowStatus] = useState(false)
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

	useEffect(() => {
		if(userInfo !== null) {
			$('#react-by-asukamis').css({ 'background-image': 'url(' + userInfo.background + ')' })
		} else {
			$('#react-by-asukamis').css({ 'background-image': 'url(http://image.superarilo.icu/defalut_bg.jpg)' })
		}
	}, [userInfo])

	return (
		<div className='render-content'>
			{
				isMobileStatus ? 
				<MobileHeaderNav
					userInfo={userInfo}
					setCreateGossipWindowStatus={setCreateGossipWindowStatus}
					openLoginBox={(status) => {
						setLoginBoxStatus(status)
					}} />
				:
				<PCheaderNav
					userInfo={userInfo}
					setCreateGossipWindowStatus={setCreateGossipWindowStatus}
					openLoginBox={e => {
						setLoginBoxStatus(e)
					}}/>
			}
			<div className={`${'router-render'} ${isMobileStatus ? 'router-render-mobile':''}`}>
				<SwitchTransition mode="out-in">
					<CSSTransition key={location.pathname} timeout={300} classNames="change" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
						<Routes location={location}>
							<Route index path='/' element={<IndexPage isMobile={ isMobileStatus } userInfo={userInfo} />} />
							<Route path='/detail' element={<ArticleDetail userInfo={userInfo} isMobile={ isMobileStatus } />} />
							<Route path='/gossip' element={<Gossip userInfo={userInfo}/>} />
							<Route path='/guestbook' element={<Guestbook />} />
							<Route path='/user/:viewUid' element={<User />} />
							<Route path='/user/verify' element={<VerifyPage />} />
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
			<CSSTransition in={createGossipWindowStatus} timeout={300} classNames="mask-fade" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
				<div className={signStyle.funtion_mask}>
					<CreateGossipWindow
						status={createGossipWindowStatus}
						userInfo={userInfo}
						setCreateGossipWindowStatus={setCreateGossipWindowStatus}/>
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

	const menuNavFunction = (object) => {
		if(menuInstance.index === object.id) return
		navigate(object.path)
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
					menuInstance.list.map(item => {
						return <li className={menuInstance.index === item.id ? 'active':''} onClick={() => { menuNavFunction(item) }} key={item.id}>{item.title}</li>
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
							iconClass='notice'
							width='2rem'
							height='2rem'
							fontSize='1.5rem'
							onClick={() => { navigate('/notice') }}/>
						<Avatar
							src={props.userInfo.avatar}
							title={props.userInfo.nickName}
							alt={props.userInfo.nickName}
							onClick={(e) => {
								setUserNavInstance({...userNavInstance, popperStatus: true, popperTarget: e.target})
							}}/>
						<Menu
							open={userNavInstance.popperStatus}
							targetElement={userNavInstance.popperTarget}
							renderObject={userNavInstance.myMenuList}
							onClickItem={id => {
								switch(id) {
									case 0:
									case 2:
										navigate(`/user/${props.userInfo.uid}`)
										break
									case 1:
										props.setCreateGossipWindowStatus(true)
										break
									case 3:
										dispatch({ type: 'userInfo/setInfo', payload: null })
										localStorage.removeItem('token')
										break
									default:
										break
								}
								setUserNavInstance({...userNavInstance, popperStatus: false, popperTarget: null})
							}}
							onClose={status => {
								setUserNavInstance({...userNavInstance, popperStatus: status})
							}}/>
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
				<div className='left-mobile-bar'>
					{
						props.userInfo !== null &&
						<>
							<Icon
								width='2.5rem'
								height='2.5rem'
								fontSize='1.3rem'
								iconClass='gossip'
								onClick={() => { props.setCreateGossipWindowStatus(true) }}/>
							<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
						</>
					}
				</div>
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
								<i className='fas fa-bell' onClick={() => {
										navigate('/notice')
										setTimeout(() => {
											setDrawerStatus(false)
										}, 500)
									}}>
									<WaterWave color="rgba(255, 255, 255, 0.7)" duration={ 500 } />
								</i>
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
											<i className='asukamis setting' />
											<span>设置</span>
											<WaterWave color="rgba(255, 255, 255, 0.7)" duration={ 500 } />
										</div>
										<div 
											className={signStyle.function_box}
											onClick={() => {
												setDrawerStatus(false)
												dispatch({ type: 'userInfo/setInfo', payload: null })
												localStorage.removeItem('token')
											}}>
											<i className='asukamis signout' />
											<span>注销</span>
											<WaterWave color="rgba(255, 255, 255, 0.7)" duration={ 500 } />
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

	const [isShowPassword, setIsShowPassword] = useState(false)
	const [emailAndUID, setEmailAndUID] = useState(null)
	const [password, setPassword] = useState(null)
	const [emailMatchRule] = useState(/^(\w+([-.][A-Za-z0-9]+)*){3,18}@\w+([-.][A-Za-z0-9]+)*\.\w+([-.][A-Za-z0-9]+)*$/)
	const [loginStatus, setLoginStatus] = useState(false)
	const loginFunction = () => {
		if(userInfo !== null) {
			toast('你已经登陆过了！')
			return
		}
		if(!loginStatus) {
			if(emailAndUID === null || emailAndUID === '' || password === null || password === '') {
				toast('输入的内容不能为空哦')
				return
			}
			toast.loading('提交中...')
			setLoginStatus(true)
			let data = new FormData()
			if(emailMatchRule.test(emailAndUID)) {
				data.append('email', emailAndUID)
			} else {
				data.append('uid', emailAndUID)
			}
			data.append('password', password)
			blogLoginUser(data).then(resq => {
				toast.dismiss()
				if(resq.code === 200) {
					localStorage.setItem('token', resq.data.token)
					dispatch({ type: 'userInfo/setInfo', payload: resq.data.user })
					toast.success(resq.message)
					setTimeout(() => { props.closeBox(false) }, 1000)
				} else {
					toast.error(resq.message)
				}
				setLoginStatus(false)
			}).catch(err => {
				toast.dismiss()
				toast.error(err.message)
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
					<label className={signStyle.input_password}>
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
					</label>
				</div>
				<button type="button" title="登录" className={signStyle.confirm_button + ' ' + (isMobileStatus ? signStyle.confirm_button_mobile:signStyle.confirm_button_pc)} onClick={() => { loginFunction() }}>
					{ !loginStatus && userInfo === null ? '登陆':'' }
					{ loginStatus ? <i className='fas fa-circle-notch fa-spin' />:'' }
					{ userInfo !== null && !loginStatus ? <i className='fas fa-check' style={{ 'color': '#80e298' }} />:''}
					<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
				</button>
				{/* <span className={signStyle.other_login_tips}>其他登录方式</span>
				<div className={signStyle.other_login_list}>
					<i className="fab fa-qq"/>
					<i className="fab fa-github"/>
					<i className="fab fa-google"/>
					<i className="fab fa-xbox"/>
				</div> */}
			</div>
		</Slide>
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
				<header className={signStyle.public_title}>
					<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
					<i className="far fa-arrow-alt-circle-left" onClick={() => { setTimeout(() => {props.closeBox(false)}, 300) }}/>
				</header>
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
						<input type="text" placeholder="请输入邮箱" onChange={e => { setInputInstance({...inputInstance, email: e.target.value}) }} />
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
										toast.loading('提交中...')
										let data = new FormData()
										data.append('mail', inputInstance.email)
										regiserMail(data).then(resq => {
											toast.dismiss()
											if(resq.code === 200) {
												toast.success(resq.message)
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
												toast(resq.message)
												setRequestStatus({...requestStatus, sendMailStatus: false})
											} else {
												toast(resq.message)
												setRequestStatus({...requestStatus, sendMailStatus: false})
											}
										}).catch(err => {
											toast.dismiss()
											setRequestStatus({...requestStatus, sendMailStatus: false})
											toast.error(err.message)
										})
									}
									
								}}>
									{
										(requestStatus.countDown === 60 && !requestStatus.sendMailStatus) && '获取验证码'
									}
									{
										requestStatus.sendMailStatus && <i className={`${'asukamis loading'} ${signStyle.rotate}`} />
									}
									{
										requestStatus.countDown < 60 && requestStatus.countDown
									}
									<WaterWave color='rgb(228, 177, 177)' duration={ 500 } />
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
								type={isShowPassword ? 'text':'password'}
								maxLength="16"
								placeholder="请输入密码"
								autoComplete="off"
								onChange={e => {
									setInputInstance({...inputInstance, password: e.target.value})
								}} />
							<i className={`${'far'} ${signStyle.input_show_password} ${isShowPassword ? 'fa-eye-slash':'fa-eye'}`} onClick={() => { setIsShowPassword(!isShowPassword) }} />
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
								type={againPassword.show ? 'text':'password'}
								maxLength="16"
								placeholder="请输入确认密码"
								autoComplete="off"
								onChange={e => {
									setAgainPassword({...againPassword, content: e.target.value})
								}} />
							<i className={`${'far'} ${signStyle.input_show_password} ${againPassword.show ? 'fa-eye-slash':'fa-eye'}`} onClick={() => { setAgainPassword({...againPassword, show: !againPassword.show}) }} />
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
							toast.loading('提交中...')
							setRequestStatus({...requestStatus, registerStatus: true})
							let data = new FormData()
							data.append('email', inputInstance.email)
							data.append('password', inputInstance.password)
							data.append('nickName', inputInstance.nickName)
							data.append('verifyCode', inputInstance.verifyCode)
							blogRegisterUser(data).then(resq => {
								toast.dismiss()
								if(resq.code === 200) {
									toast.success(resq.message)
									setTimeout(() => {
										clearInterval(intervalID.current)
										intervalID.current = null
										props.openLoginBox(true)
										props.closeBox(false)
									}, 500)
								} else if(resq.code === 0) {
									toast(resq.message)
								} else {
									toast.error(resq.message)
								}
								setRequestStatus({...requestStatus, registerStatus: false})
							}).catch(err => {
								toast.dismiss()
								setRequestStatus({...requestStatus, registerStatus: false})
								toast.error(err.message)
							})
						}
					}}>
					{
						requestStatus.registerStatus ? <i className='fas fa-circle-notch fa-spin' />:'注册'
					}
					<WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
				</button>
			</div>
		</Slide>
	)
}
export default App