
//使用Card、Form组件搭建基本页面结构

import { PlusOutlined } from "@ant-design/icons"
import { Breadcrumb, Button, Card, Form, Input, message, Radio, Select, Space, Upload } from "antd"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { observer } from "mobx-react-lite";
//导入富文本编辑器
// import MyEditor from  './bianjiqi'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { http } from "@/utils";

const Publish = () => {
  const { channerlStore } = useStore()
  //存放上传图片列表
  const [fileList, setFileList] = useState([])  //由于是列表所以存放数组

  //1.声明一个暂存仓库
  const cacheImgList = useRef([])
  const onUploadChange = ({ fileList }) => {
    //采取受控的写法:在最后一次logo里放response
    //最终react state fileList中存放的数据有response.data.url
    const formatList=fileList.map(file=>{
      if(file.response){
        return {
          url:file.response.data.url
        }
      }
      return file
    })
    setFileList(formatList)
    //2.上传图片时,将所有图片存储到ref中
    cacheImgList.current = formatList
  }
  const [imgCount, setImgCount] = useState(1)

  //切换图片
  const onChangeRadio = (e) => {
    //从这里的判断依据我们来采取原始值 不采取经过useState方法修改之后的数据
    //useState修改之后的数据,无法同步获取修改之后的新值
    const rawValue=e.target.value
    setImgCount(rawValue)
    //从仓库里面取对应的图片数量 交给我们用来渲染图片列表的fileList
    //通过调用setFileList
    if (cacheImgList.current.length === 0) {
      return false
    }
    
    if (rawValue === 1) {
      const img = cacheImgList.current ? cacheImgList.current[0] : []
      setFileList([img])
    } else if (rawValue === 3) {
      setFileList(cacheImgList.current)
    }
  }

  //提交
  const navgiate=useNavigate()
  const onFinish= async (values)=>{
    console.log(values)
    //数据的二次处理
    const {channel_id,content,title,type}= values
    const params={
      channel_id,
      content,
      title,
      type,
      cover:{
        type:type,
        images:fileList.map(item=>item.url)
      }
    }
    if(id){
      await http.put(`/mp/articles/${id}?draft=false`,params)
    }else{
      await http.post('/mp/articles?draft=false',params)
    }
    navgiate('/article')
    message.success(`${id}?'更新成功':'发布成功'`)
  }

  //编辑功能
  //文案适配 路由参数id 判断条件
  const [params] = useSearchParams()  //获取当前url中查询字符串
  const id = params.get('id')
  console.log('route:',id)

  //数据回填  id调用接口 1.表单回填 2.暂存列表 3.Upload组件fileList
  const form=useRef(null)
  useEffect(()=>{
      const loadDetail=async ()=>{
       
        const res=await http.get(`/mp/articles/${id}`)
        const data=res.data
        //表单数据回调 实例方法  setFieldsValue是更改的方法 res.data是存的数据
        form.current.setFieldsValue({...data,type:data.cover.type})

        const formatImg=data.cover.images.map(url=>{
          return{
            url
          }   //es6简写 原 url=>{return url:url} 
      })
        //用setFileList方法来回填 找到原图片
        setFileList(formatImg)
      cacheImgList.current=formatImg
      }
      if(id){
        loadDetail()
        console.log(form.current)
      }
    }
    ,[id])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id? '编辑':'发布'}文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >

        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: '' }}
        onFinish={onFinish}
        ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channerlStore.channelList.map(item =>
              (
                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              )
              )}

            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onChangeRadio}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>

            {imgCount > 0 && (<Upload
              name="image"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList
              action="http://geek.itheima.net/v1_0/upload"
              fileList={fileList}
              onChange={onUploadChange}
              //控制是否是多传
              multiple={imgCount > 1}  //如果imgCount大于1则就可以多传
              //最大图片限制
              maxCount={imgCount}   //value是三 则他最大的就是三  
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>)
            }
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            {/* <MyEditor/> */}
            {/* 这里的富文本组件 已经被Form.Item控制 */}
            {/* 他的输入会在onFinished回到里收集起来 */}
            <ReactQuill theme="snow" style={{height:'200px',marginBottom:'50px',placeholder:'请输入内容'}} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {id?'编辑':'发布'}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
export default observer(Publish)