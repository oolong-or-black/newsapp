import React, { useEffect, useState } from 'react'
import { Table, Button, notification, Modal } from 'antd'
import { ExclamationCircleOutlined }from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal
export default function NewsPublish(props) {
  const [ dataSource, setDataSource ] = useState([])
  const Actions = ['','Publish', 'Sunset', 'Delete']
  const { publishState, username } = props

  useEffect(()=>{
    axios.get(`/news?author=${username}&publishState=${publishState}&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[publishState,username])

  const handleAction = (id)=>{    
    switch(publishState){
      case 1:
        axios.patch(`/news/${id}`,{
          publishState: 2,
          publishTime:Date.now()
        })
        notification.info({
          title:'Notification',
          message:'You can view that news in the Published List',
          placement:'top'
        })
        setDataSource(dataSource.filter(item=>item.id !==id)) 
        return;
      case 2:
        axios.patch(`/news/${id}`,{
          publishState: 3,
        })
        notification.info({
          title:'Notification',
          message:'You can view that news in the Sunset List',
          placement:'top'
        })
        setDataSource(dataSource.filter(item=>item.id !==id)) 
        return;
     case 3:
        confirm({
          title:'Do you want to delete this published news?',
          icon: <ExclamationCircleOutlined/>,
          onCancel(){},
          onOk(){
            axios.delete(`/news/${id}`)
            setDataSource(dataSource.filter(item=>item.id !==id)) 
          }
        })
        return;    
      default: return  
    }      
  }

  const columns = [
    {
      title:'Title',
      render: item =><div style={{width:'400px'}}><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></div>
    },
    {
      title:'Author',
      dataIndex: 'author'
    },
    {
      title:'Category',
      dataIndex:'category',
      render: category=>category.title
    },
    {
      title:'Actions',
      render:item=>
        <Button 
          onClick={()=>handleAction(item.id)} 
          type={publishState===1? 'primary':''}
          style={publishState>1? {color:'red', borderColor:'red'}:{}}
        >
          {Actions[publishState]}
        </Button>
    }
  ]
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={item=>item.id}
      pagination={{pageSize:5}}
    />
  )
}
