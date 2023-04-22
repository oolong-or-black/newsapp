import { Button, Table, Tag, Modal, Switch } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons'

const { confirm } = Modal
export default function RightList() {
  const [ rightList, setRightList ] =useState([])

  useEffect(()=>{
    axios.get('/rights?_embed=children').then(res=>{
      setRightList(res.data.map(item=>{
        if(item.children.length === 0){
          item.children = ''
        }
        return item
      }))
    })
  },[])

  const handleDelete = (item)=>{
    console.log(item)
    confirm({
      title:'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined/>,
      onCancel(){},
      onOk(){
        axios.delete(`/rights/${item.id}`)
        setRightList(rightList.filter(data=>data.id!==item.id))
      }
    })
  }

  const handleSwitch = (item)=>{
    console.log(item)
    item.pagepermission = item.pagepermission? 0:1
    setRightList([...rightList])
    console.log(rightList)
    if(item.grade===1){
      axios.patch(`/rights/${item.id}`,{
        pagepermission:item.pagepermission
      })
    } else{
      axios.patch(`/children/${item.id}`,{
        pagepermission:item.pagepermission
      })
    }
  }

  const columns = [
    {
      title:'ID',
      dataIndex:'id',
      render: id=><b>{id}</b>
    },
    {
      title:'Rights',
      dataIndex:'title'
    },
    {
      title: 'Routes',
      dataIndex:'key',
      render:item=><Tag color='orange'>{item}</Tag>
    },
    {
      title:'Actions',
      render:item=><>
        <Button danger shape='circle' icon={<DeleteOutlined />} onClick={()=>handleDelete(item)}></Button>
        <span style={{margin:'0 5px'}} />
        <Switch 
          disabled={!Object.keys(item).includes('pagepermission')} 
          checked={item.pagepermission? true:false} 
          onChange={()=>handleSwitch(item)}/>
      </>
    }
  ]
  return (
    <Table 
      columns={columns}
      dataSource={rightList}
      rowKey={item=>item.id}
    />
  )
}
