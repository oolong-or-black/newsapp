import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, Avatar, List, Drawer } from 'antd'
import { useSelector } from 'react-redux'
import { EditOutlined, EllipsisOutlined, PieChartOutlined, BarChartOutlined } from '@ant-design/icons'
import axios from 'axios'
import * as echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card
export default function Overview() {
  const { user } = useSelector(state=>state.user)
  const [ viewList, setViewList ] = useState([])
  const [ likeList, setLikeList ] = useState([])
  const [ open, setOpen ] = useState(false)
  const [ pieData, setPieData ] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()

  useEffect(()=>{
    axios.get('/news?publishState=2&_sort=view&_order=des&_limit=6').then(res=>{
      setViewList(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get('/news?publishState=2&_sort=star&_order=des&_limit=6').then(res=>{
      setLikeList(res.data)
    })    
  },[])

  useEffect(()=>{
    axios.get('/news?publishState=2&_expand=category').then(res=>{
      renderBarChart(_.groupBy(res.data, item=>item.category.title))       
      var list = res.data.filter(item=>item.author===user.username)
      setPieData(_.groupBy(list, item=>item.category.title)) 
    })
    return ()=>{
      window.onresize = null 
    }
  },[user])

  const renderBarChart = (barData)=>{
    let barChart =  echarts.getInstanceByDom(barRef.current) || echarts.init(barRef.current)
    barChart.setOption({
      title: {
        text: 'News by category'
      },
      tooltip: {},
      legend:{
        data:['category']
      },
      xAxis: {
        data: Object.keys(barData),
        axisLabel:{
          rotate: 45,     
          interval: 0   
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: 'category',
          type: 'bar',
          data: Object.values(barData).map(item=>item.length)
        }
      ]
    })
    window.onresize = ()=>{
      barChart.resize()
    }
  }

  const renderPieChart = () =>{
    let pieChart = echarts.getInstanceByDom(pieRef.current) || echarts.init(pieRef.current)
    var datalist = []
    for( var i in pieData){
      datalist.push({
        name: i,
        value: pieData[i].length
      })
    }
    pieChart.setOption({
      title:{
        text:'Personal Published News',
        left:'center'
      },
      tooltip:{
        trigger: 'item'
      },      
      series: [
        {
          type: 'pie',
          name: 'published news',
          radius:'90%',
          data: datalist,
          label:{
            // rotate: 15,
            position: 'inner',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }  
        }   
      ]
    })
  }
  return (
    <div >
       <Row gutter={16}>
        <Col span={8}>
          <Card title={<span>Be viewed most ... <BarChartOutlined /></span>} bordered={false} >
            <List
              dataSource={viewList}
              renderItem={ (item) => <List.Item>
                <a href={`#/newsdetail/${item.id}`}>{item.title}</a> 
              </List.Item> }
            >  
            </List>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<span>Be liked most ... <BarChartOutlined /></span>} bordered={false}>
          <List
              dataSource={likeList}
              renderItem={ (item) => <List.Item>
                <a href={`#/newsdetail/${item.id}`}>{item.title}</a> 
              </List.Item> }
            >  
            </List>
          </Card>
        </Col>
        <Col span={8}>
          <Card     
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined 
                key='piechart' 
                onClick={()=>{
                  setOpen(true)
                  setTimeout(()=>{
                    renderPieChart()
                  },1000)
                }}/>,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=random" />}
              title={user.username}
              description={<>
                <b>{ user.region ===''? 'Worldwide': user.region}</b>
                <span style={{margin:'0 10px'}}>{user.role.roleName}</span>
              </>}
            />            
          </Card>
        </Col>
      </Row>

      <Drawer title="Basic Drawer" placement="right" onClose={()=>{setOpen(false)}} open={open} >
        <div ref={pieRef} style={{width:'100%',height:'400px'}}/>        
      </Drawer>        
      <div ref={barRef} style={{width:'100%',height:'400px',marginTop:'30px'}}/> 
    </div>
  )
}
