import { Menu, Popconfirm,Layout } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import React, { useEffect } from 'react'
import './index.scss'
//Outlet打印父组件的路由组件,link打印组件,  useLocation获取当前浏览器上的路由状态对象
import { Outlet,Link,useLocation,useNavigate } from 'react-router-dom'
//连接mobx 他的值已经存到mobx里了 但是尚未连接
import {observer} from 'mobx-react-lite'
import {useStore} from '@/store'
const {Header,Sider}=Layout

function GeekLayout() {
  const {userStore,loginStore,channerlStore}=useStore()

  const {pathname}=useLocation()
  console.log(pathname)
  //hook状态
  useEffect(()=>{
    try{
      userStore.getUserInfo() 
      channerlStore.loadChannelList()
    }catch{}
    
  },[userStore,channerlStore])

  const items=[
    {
      icon:<HomeOutlined/>,
      label:<Link to="/" style={{color:'black'}}>数据概览</Link>,
      key:'/',
      style:{color:'black'}
    },
    {
      icon:<DiffOutlined/>,
      label:<Link to='/article' style={{color:'black'}}>内容管理</Link>,
      key:'/article',
      style:{color:'black'}
    },
    {
      icon:<EditOutlined/>,
      label:<Link to="/publish" style={{color:'black'}}>发布文章</Link>,
      key:'/publish',
      style:{color:'black'}
    }
  ]
  //所有的hooks 组件中 要么你在hooks里使用， 要么你就在函数组件里面使用 别的地方是不可以的
  
  const navgiate=useNavigate()
  const onConfirm=(a)=>{
    //退出登录  删除token 跳回到登录页面
    loginStore.loginToken()
    console.log(a)
    navgiate('/login')
  }
  return (
    <Layout>
    <Header className="header">
      <div className="logo" />
      <div className="user-info">
        <span className="user-name">{userStore.userInfo.name}</span>
        <span className="user-logout">
          <Popconfirm 
          //确认退出的回调
          onConfirm={onConfirm}
           title="是否确认退出？" okText="退出" cancelText="取消">
            <LogoutOutlined/><span>退出</span>
          </Popconfirm>
        </span>
      </div>
    </Header>
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          theme="dark"
          defaultSelectedKeys={pathname}   //高亮原理是:defaultSelectedKeys===Items的key 则就会亮
          style={{ height: '100%', borderRight: 0 }}
          selectedKeys={pathname}
          items={items}
          className="giao"
        >
        </Menu>
      </Sider>
      <Layout className="layout-content" style={{ padding: 20}}>
        {/* 二级路由 暴漏他路由的位置 */}
        <Outlet/>

        
      </Layout>
    </Layout>
  </Layout>
  )
}
export default observer(GeekLayout)