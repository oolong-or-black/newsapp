import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Input } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined }from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal
export default function NewsCategory() {
  const [ categoryList, setCategoryList ] = useState([])

  useEffect(()=>{
    axios.get('/categories').then(res=>{
      setCategoryList(res.data)
    })
  },[])

  const handleAdd = ()=>{
    axios.post('/categories',{
      value:'',
      title:''
    }).then(res=>{
      console.log(res.data)
      setCategoryList([...categoryList,res.data])
    })
  }

  const handleChange = (e,id)=>{
    axios.patch(`/categories/${id}`,{
      title: e.target.value,
      value: e.target.value
    })
  }

  const handleDelete = (id)=>{
    confirm({
      title:'Do you want to delete this category?',
      icon: <ExclamationCircleOutlined/>,
      onCancel(){},
      onOk(){
        setCategoryList(categoryList.filter(item=>item.id!==id))
        axios.delete(`/categories/${id}`)
      }
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id=><b>{id}</b>
    },
    {
      title:'Category',
      render: item=><Input defaultValue={item.title} style={{border:'none'}} onBlur={(e)=>handleChange(e,item.id)}/>
    }, 
    {
      title:'Actions',
      render: item=><Button danger shape='circle' icon={<DeleteOutlined/>} onClick={()=>handleDelete(item.id)}></Button>
    }
  ]

  return (
    <div>
      <Button onClick={handleAdd}  type="primary" style={{ marginBottom:16 }} >
        Add a category
      </Button>
      <Table
        dataSource={categoryList}
        columns={columns}
        pagination={{pageSize:7}}
        rowKey={item=>item.id}
      />
    </div>
  )
}
