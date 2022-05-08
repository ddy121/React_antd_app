import Bar from '@/components/Bar'
import './index.scss'

//思路：
//1.看官方文档的参数 先把最小化的demo跑起来
//2.不抽离定制化的参数，先把最小化的demo跑起来
//3.按照需求，哪些 参数需要自定义 抽象出来

const Home = () => {
    
    //渲染bar组件
    return (
        <div>
            <Bar title='框架满意程度' xData={['Vue','Angular','React']} yData={[10,10,30]} style={{width:400,height:300}}/>
            <Bar title='图书观看完结' xData={['Vue','Angular','React']} yData={[10,10,30]} style={{width:400,height:300}}/>

        </div>
    )

}
export default Home