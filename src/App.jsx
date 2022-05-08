import React from 'react'
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom'
//把刚刚封装过的history的包 导进来
import {history} from './utils/history'
//Layout组件
import Layout from '@/pages/Layout'
// Login组件
import Login from '@/pages/Login'
//引入是否登录的那个包
import { AuthComponent } from '@/components/AuthComponent'
//引入路由组件
import Article from './pages/Layout/Article'
import Home from './pages/Layout/Home'
import Publish from './pages/Layout/Publish'
//css样式表
import '@/App.css'
function App() {
  return (
    //路由配置
    <HistoryRouter history={history}>
      <div className='App'>
        <Routes>
          {/* 创建路由path和组件对应的关系 */}
          {/* 把layout包裹起来判断是否登录过 */}
          <Route path='/' element={
            <AuthComponent>
              <Layout />
            </AuthComponent>
          }>
            <Route index element={<Home/>}></Route>
            <Route path='/article' element={<Article/>}></Route>
            <Route path='/publish' element={<Publish/>}></Route>
          </Route>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </div>
    </HistoryRouter>

  )
}
export default App