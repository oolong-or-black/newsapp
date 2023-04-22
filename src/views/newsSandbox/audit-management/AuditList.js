import React, { useEffect, useState } from 'react'
import { Button, notification, Table, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'

export default function AuditList() {
  const [ dataSource, setDataSource ] = useState([])
  const Status = ['Pending','In progress', 'Approved','Declined']
  const Colors = ['white','orange','green','red']
  const Actions = ['','Withdraw','Publish','Edit']
  const navigate = useNavigate()
  const { user:{username} } = useSelector(state=>state.user)
  
  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState_ne=0&publishState=0&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[username])

  const handleAction = (id, auditState)=>{
    switch(auditState){
      case 1:
        axios.patch(`/news/${id}`,{
          auditState:0
        })
        setDataSource(dataSource.filter(item=>item.id !== id))
        notification.info({
          message:'Notification',
          description:'You can view that news in the Drafts',
          placement: 'top'
        })
        return;
      case 2:
        axios.patch(`/news/${id}`,{
          publishState: 2,
          publishTime:Date.now()
        })  
        setDataSource(dataSource.filter(item=>item.id !== id))
        notification.info({
          message:'Notification',
          description:'You can view that news in the Published List',
          placement: 'top'
        })
        return;
      case 3:
        navigate(`/news-manage/update/${id}`)
        return;  
      default: return
    }   
  }

  const columns = [
    {
      title: 'Title',
      render: item=><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
    },
    {
      title:'Author',
      dataIndex: 'author'
    },
    {
      title:'Category',
      dataIndex:'category',
      render: item=>item.value
    },
    {
      title:'Audit Status',
      dataIndex: 'auditState',
      render: state=><Tag color={Colors[state]}>{Status[state]}</Tag>
    },
    {
      title:'Actions',
      render:item=><>
        <Button 
          onClick={()=>handleAction(item.id,item.auditState)}
          style={{color: Colors[item.auditState], borderColor:Colors[item.auditState], width:100}} 
        >
          {Actions[item.auditState]}
        </Button>        
      </>
    }
  ]

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={item=>item.id}
      pagination={{pageSize:5}}
    />
  )
}
