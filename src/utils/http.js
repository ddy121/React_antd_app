/* eslint-disable no-restricted-globals */
//封装axios
//实例化  请求拦截器
import axios from 'axios'
import { getToken } from './token';
import { history } from './history';
const http=axios.create({
    baseURL:'http://geek.itheima.net/v1_0/',
    timeout:1000
})
//添加请求拦截器
http.interceptors.request.use((config)=>{
    const token=getToken()
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config;
},error=>{
    return Promise.reject(error)
})

//响应拦截器
http.interceptors.response.use(response=>{
    return response.data  
},error=>{
    if (error.response.status === 401) {
        //如果身份缺失，则跳到登录页面，跳回到登录，reactRouter默认状态下，并不支持组件之外的路由跳转
        console.log('login')
        history.push('/login')
      }
    return Promise.reject(error)
})

export { http }