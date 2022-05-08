import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
function Bar({title,xData,yData,style}){
    const getDom = useRef()
    const chartInit = () => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(getDom.current);
        // 绘制图表
        myChart.setOption({
            title: {
                text: title
            },
            tooltip: {},
            xAxis: {
                data: xData
            },
            yAxis: {},
            series: [
                {
                    name: '销量',
                    type: 'bar',
                    data: yData
                }
            ]
        });
    }
    //执行这个初始化的函数  
    useEffect(() => {
        chartInit()
    }, [])
    return(
        <div ref={getDom} style={style}>
        </div>
    )
}

export default Bar
