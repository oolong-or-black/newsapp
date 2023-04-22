import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Tree } from 'antd'
import axios from 'axios'
import {EditOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';

const { confirm } = Modal
export default function RoleList() {
  const [ roleList, setRoleList ] = useState([])
  const [ rightList, setRightList ] = useState([])
  const [ authorizeList, setAuthorizeList ] = useState([])
  const [ isModalOpen, setIsModalOpen ] = useState(false)
  const [ currentId, setCurrentId ] = useState(null)

  useEffect(()=>{
    axios.get('/roles?id_ne=4').then(res=>{
      setRoleList(res.data)
      console.log(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get('/rights?_embed=children').then(res=>{
      setRightList(res.data)
    })
  },[])

  const handleDelete = (item)=>{
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      onOk(){
        axios.delete(`/roles/${item.id}`)
        setRoleList(roleList.filter(data=>data.id!==item.id))
      },
      onCancel(){}
    })
  }

  const handleEdit = (item)=>{
    setIsModalOpen(true)
    setAuthorizeList(item.rights)
    setCurrentId(item.id)
  } 

  const handleCheck = (item)=>{
    setAuthorizeList(item)
  }

  const handleUpdate = ()=>{
    setIsModalOpen(false)
    axios.patch(`/roles/${currentId}`,{
      rights:authorizeList
    })
    setRoleList(roleList.map(item=>{
      if(item.id===currentId){
        item.rights = authorizeList
      }
      return item
    }))    
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: item=><b>{item}</b>
    },
    {
      title:'Roles',
      dataIndex:'roleName'
    },
    {
      title:'Actions',
      render: item=><>
        <Button shape='circle' danger onClick={()=>handleDelete(item)} icon={<DeleteOutlined />} ></Button>
        <span style={{margin:'0 5px'}}></span>
        <Button shape='circle' type='primary' onClick={()=>handleEdit(item)} icon={<EditOutlined />}></Button>
        </>
    }
  ]
  return (
  <>
    <Table 
      columns={columns}
      dataSource={roleList}
      pagination={{pageSize:5}}
      rowKey={item=>item.id}
    />

    <Modal 
      title='Rights authorized'
      open={isModalOpen}
      okText='Update'
      onOk={handleUpdate}
      onCancel={()=>{setIsModalOpen(false)}}
    >
      <Tree
        checkable
        treeData={rightList}
        checkedKeys={authorizeList}
        onCheck={handleCheck}
      />
    </Modal>
  </>  
  )  
}
