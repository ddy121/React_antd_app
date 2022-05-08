import { Breadcrumb, Button, Card, Form, Radio, Select, DatePicker, Table, Tag, Space } from "antd"
// import { Option } from "antd/lib/mentions"
import { Link,useNavigate } from "react-router-dom"
//两个中文包
import 'moment/locale/zh-cn'
import locale from "antd/lib/date-picker/locale/zh_CN"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
//假如出错的文件夹
import img404 from '@/assets/error.png'
import { useEffect, useState } from "react"
import { http } from "@/utils"
import { useStore } from "@/store"
import { observer } from "mobx-react-lite"
//图书管理
function Article() {
    const {channerlStore}=useStore()
    //频道列表管理
    const { RangePicker } = DatePicker
    const onFinish = (values) => {
        console.log(values)

        const { change_id, date, status } = values
        //数据处理
        const _params = {}
        //如果不是全部的话 那就给他赋值
        if (status !== -1) {
            _params.status = status
        }
        //如果有change_id 则直接赋值
        if (change_id) {
            _params.change_id = change_id
        }
        //
        if (date) {
            //params.begin_pubdate接口的格式要的
            _params.begin_pubdate = date[0].format('YYYY-MM-DD')
            _params.end_pubbtate = date[1].format('YYYY-MM-DD')
        }
        //修改params数据，引起接口的重新发送，对象的合并是一个整体的覆盖 ， 改了对象的整体引用
        setParams({ ...params, ..._params })
    }

    // 文章列表管理 统一管理数据 将来修改给setArticleData传对象
    const [articleData, setArticleData] = useState({
        list: [],// 文章列表
        count: 0 // 文章数量
    })

    // 文章参数管理
    const [params, setParams] = useState({
        page: 1,
        per_page: 5
    })
    //如果异步请求函数需要一些数据变化而重新执行
    //推荐把它写到内部
    //统一不抽离函数到外面，只要涉及到异步请求的函数 都放到useEffect内部中
    //本质的区别：写到外面每次组件更新都会重新进行函数初始化 这本身就是一次性能消耗
    //而写到useEffect中，只会在依赖项发生变化的时候 函数才会进行重新初始化
    //避免性能消耗
    // 获取文章列表
    useEffect(() => {
        const loadList = async () => {
            const res = await http.get('/mp/articles', { params })
            const { results, total_count } = res.data
            setArticleData({
                list: results,
                count: total_count
            })
        }
        loadList()
    }, [params])
    //他分页的回调
    const pageChange = (page) => {
        setParams({
            ...params,
            page
        })
    }
    //删除
    const delArticle = async (data) => {
        console.log(data)
        await http.delete(`/mp/articles/${data.id}`)
        setParams({
            ...params,
            page: 1
        })
    }
    //编辑
    const navgite=useNavigate()
    const onPublish=(data)=>{
        navgite(`/publish?id=${data.id}`)
    }   
    //列打印
    const colums = [
        {
            title: '封面',
            dataIndex: 'cover',
            render: cover => {
                return <img src={cover.images[0] || img404} width={200} height={150} alt='' />
            }
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220,
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: data => <Tag color="green">审核通过</Tag>
        },
        {
            title: '发布时间',
            dataIndex: 'pubdate'
        },
        {
            title: '阅读数',
            dataIndex: 'read_count'
        },
        {
            title: '评论数',
            dataIndex: 'comment_count'
        },
        {
            title: '点赞数',
            dataIndex: 'like_count'
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        {/* 俩按钮 */}
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={()=>onPublish(data)}
                            />
                           
                        <Button
                            type="primary"
                            danger
                            shape='circle'
                            onClick={() => delArticle(data)}
                            icon={<DeleteOutlined />}
                        />

                    </Space>
                )
            }
        }

    ]
    return (
        <div>
            {/* 筛选区域 */}
            <Card title={
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to={'/home'}>首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>内容管理</Breadcrumb.Item>
                </Breadcrumb>
            }
                style={{ marginBottom: 50 }}
            >
                <Form initialValues={{ status: -1 }}
                    onFinish={onFinish}
                >
                    <Form.Item label="状态" name="status">
                        <Radio.Group>
                            <Radio value={-1}>全部</Radio>
                            <Radio value={0}>草稿</Radio>
                            <Radio value={1}>待审核</Radio>
                            <Radio value={2}>审核通过</Radio>
                            <Radio value={3}>审核失败</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="频道" name="change_id">
                        <Select
                            placeholder="请选择文章"
                            style={{ width: 120 }}
                        >
                            {
                                channerlStore.channelList.map(item => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))
                            }


                        </Select>
                    </Form.Item>
                    <Form.Item label="日期" name="date">
                        {/* 传入locale,控制中文显示 */}
                        <RangePicker locale={locale}></RangePicker>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>筛选</Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* 文章列表区域 */}
            <Card title={`根据筛选条件共查询到${articleData.count}条结果： `}>
                <Table rowKey="id"
                    columns={colums}
                    dataSource={articleData.list}
                    pagination={{
                        pageSize: params.per_page,
                        total: articleData.count,
                        onChange: pageChange  //分页
                    }
                    }
                />
            </Card>
        </div>
    )
}
export default observer(Article)