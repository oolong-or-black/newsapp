import React, { useEffect, useState } from 'react'
import { Button, notification, Table } from 'antd'
import axios from 'axios'
import { useSelector } from 'react-redux'

export default function Audit() {
  const [ dataSource, setDataSource ] = useState([])
  const { user } = useSelector(state=>state.user)

  useEffect(()=>{
    axios.get('/news?auditState=1&_expand=category').then(res=>{
      if(user.roleId ===1){
        setDataSource(res.data)
      } else {
        setDataSource(res.data.filter(item=> item.roleId>user.roleId && item.region === user.region ))
      }  
    })
  },[user])

  const handleAudit = (id, auditState)=>{
    axios.patch(`/news/${id}`,{
      auditState: auditState,
      publishState: auditState===2? 1:0
    })
    setDataSource(dataSource.filter(item=>item.id !== id))
    notification.info({
      message:'Notification',
      description:'You can view that news in the Audit-List',
      placement: 'top'
    })
  }

  const columns = [
    {
      title: 'Title',
      render: item=><div style={{width:'400px'}}><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></div>
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
      title:'Actions',
      render:item=><>
        <Button type='primary' onClick={()=>handleAudit(item.id,2)}>Approve</Button>
        <Button danger style={{marginLeft:10}}onClick={()=>handleAudit(item.id,3)}>Decline</Button>
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
