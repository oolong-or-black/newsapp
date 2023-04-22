import React, { useEffect, useState } from 'react'
import { Button, Table, Modal } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined }from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const { confirm } = Modal
export default function NewsDraft() {
  const [ newsList, setNewsList ] = useState([])
  const navigate = useNavigate()
  const { user:{username} } = useSelector(state=>state.user)
  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res=>{
      setNewsList(res.data)
    })
  },[username])

  const handleDelete = (id)=>{
    confirm({
      title: 'Do you want to delete this news?',
      icon:<ExclamationCircleOutlined/>,
      onCancel(){},
      onOk(){
        axios.delete(`/news/${id}`)
        setNewsList(newsList.filter(data=>data.id !==id))
      }
    })
  }

  const handleEdit = (id)=>{
    navigate(`/news-manage/update/${id}`)
  }

  const handleSubmit = (id)=>{
    setNewsList(newsList.filter(data=>data.id !==id))
    axios.patch(`/news/${id}`,{
      auditState:1
    })
  }
  const columns = [
    {
      title: 'ID',
      dataIndex:'id',
      render: id=><b>{id}</b>
    },
    {
      title: 'Title',
      render: item=><div style={{width:'400px'}}><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></div> 
    },
    {
      title:'Author',
      dataIndex:'author'
    },
    {
      title:'Category',
      dataIndex:'category',
      render:item=><span>{item.title}</span>
    },
    {
     title:'Actions',
     render: item=><>
      <Button danger shape='circle' icon={<DeleteOutlined/>} onClick={()=>handleDelete(item.id)}/>
      <Button shape='circle' icon={<EditOutlined/>} onClick={()=>handleEdit(item.id)} style={{margin:'0 10px'}}/>
      <Button shape='circle' icon={<UploadOutlined/>} onClick={()=>handleSubmit(item.id)} type='primary'/>
     </>
    }
  ]
  return (
    <Table
      dataSource={newsList}
      columns={columns}
      pagination={{pageSize:5}}
      rowKey={item=>item.id}
    />
  )
}
