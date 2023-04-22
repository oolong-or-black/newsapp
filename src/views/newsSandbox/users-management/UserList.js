import React, { useEffect, useRef, useState } from 'react'
import { Button, Table, Switch, Modal } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined }from '@ant-design/icons'
import UserForm from '../../../components/users-management/UserForm'
import { useDispatch, useSelector } from 'react-redux'
import { DisableOff } from '../../../redux/disableSlice'

const { confirm} = Modal
export default function UserList() {
  const [ userList, setUserList ] = useState([])
  const [ regionList, setRegionList ] = useState([])
  const [ roleList, setRoleList ] = useState([])
  const [ allUsernames, setAllUsernames ] = useState([])
  const [ targetUser, setTargetUser ] = useState(null)
  const [ isUpdateOpen, setIsUpdateOpen ] = useState(false)
  const [ isAddOpen, setIsAddOpen ] = useState(false)
  const updateUser = useRef()
  const addUser = useRef()
  const { user } = useSelector(state=>state.user)
  const dispatch = useDispatch()

  const {region, roleId} = user
  useEffect(()=>{
    axios.get(`/users?roleId_ne=4&_expand=role`).then(res=>{
      if(roleId===1){
        setUserList(res.data)
      } else{
        setUserList(res.data.filter(item=>item.roleId>roleId && item.region===region))
      }
    })
  },[region, roleId])

  useEffect(()=>{
    axios.get('/regions').then(res=>{
      setRegionList(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get('/roles').then(res=>{
      setRoleList(res.data.filter(item=>item.roleType!==4))
    })
  },[])

  useEffect(()=>{
    axios.get('/users').then(res=>{
      setAllUsernames(res.data.map(item=>item.username))
    })
  },[isUpdateOpen])

  // switch to change the user's roleState
  const handleChange = (item)=>{
    item.roleState = !item.roleState
    setUserList([...userList])
    axios.patch(`/users/${item.id}`,{
      roleState: item.roleState
    })
  }

  // click to delete one user
  const handleConfirm = (item)=>{
    confirm({
      title:'You are going to delete this user...',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure to delete it?',
      onOk(){
        setUserList(userList.filter(data=>data.id!==item.id))
        axios.delete(`/users/${item.id}`)
      }
    })
  } 

  // click to update the user's data
  const handleUpdate = (item)=>{
    // console.log(item)    
    setIsUpdateOpen(true)
    setTimeout(()=>{
      updateUser.current.setFieldsValue(item)
    },0)
    setTargetUser(item)
  }

  // confirm that the user data has been updated
  const updateUserOk =  async ()=>{
    updateUser.current.validateFields().then(value=>{
      setIsUpdateOpen(false)
      updateUser.current.resetFields()
      setUserList(userList.map(item =>{
        if(item.id === targetUser.id ){
          return {
            ...item,
            ...value,
            default: value.roleId === 1 ? true: false,
            role: roleList.filter(data=>data.id === value.roleId)[0]
          }
        }
        return item
      }))
      axios.patch(`/users/${targetUser.id}`,{
        ...value,
        default: value.roleId === 1 ? true: false
      })
      dispatch(DisableOff())
    })
  }

  // click to add a new user
  const addUserOk = ()=>{
    addUser.current.validateFields().then(value=>{
      addUser.current.resetFields()
      dispatch(DisableOff())
      axios.post('/users',{
        ...value,
        default: value.roleId===1? true:false,
        roleState:true
      }).then(res=>{
        setUserList([
          ...userList,
          {  
            ...res.data,
            role:roleList.filter(item=>item.id === res.data.roleId)[0]
          }  
        ])
        setAllUsernames([
          ...allUsernames, res.data.username
        ])
      })
      setIsAddOpen(false)
    })
  }

  const columns = [
    {
      title:'Region',
      dataIndex:'region',
      filters:[
        ...regionList.map(data=>({
          text:data.title,
          value:data.value
        })),
        {
          text:'Worldwide',
          value:''
        }  
      ],
      onFilter:(value,item)=>item.region===value,
      render: (item)=><b>{item===''? 'Worldwide':item}</b>
    },
    {
      title:'Role Name',
      dataIndex:'role',
      render: (item)=>item.roleName
    },
    {
      title:'Username',
      dataIndex:'username'
    },
    {
      title:'Role State',
      dataIndex:'roleState',
      render: (roleState,item)=>
        <Switch checked={roleState} 
          disabled={item.default} 
          onChange={()=>handleChange(item)}
        ></Switch>
    },
    {
      title:'Action',
      render:(item)=><>
        <Button danger shape='circle' disabled={item.default} onClick={()=>handleConfirm(item)}><DeleteOutlined /></Button>
        <span style={{margin:'0 5px'}}></span>
        <Button shape='circle' type='primary' disabled={item.default} onClick={()=>handleUpdate(item)}><EditOutlined /></Button>
      </>
    }
  ]
  return (
    <div>
      <Button type='primary' onClick={()=>setIsAddOpen(true)}>Add new user</Button>
      <Table dataSource={userList} columns={columns} rowKey={(item)=>item.id} pagination={{pageSize:7}}/>

      <Modal 
        title='Update user'
        open={isUpdateOpen} 
        okText='Update'
        onOk={updateUserOk} 
        onCancel={()=>{
          setIsUpdateOpen(false)
          dispatch(DisableOff())
        }}
      >
        <UserForm 
          ref={updateUser} 
          regionList={regionList} 
          roleList={roleList} 
          allUsernames={allUsernames}
          targetUser={targetUser}
          roleId={roleId}
          region={region}
        />
      </Modal>

      <Modal 
        title='add user'
        open={isAddOpen} 
        okText='Add'
        onOk={addUserOk} 
        onCancel={()=>{
          setIsAddOpen(false)
          dispatch(DisableOff())
          addUser.current.resetFields()
        }}
      >
        <UserForm 
          ref={addUser} 
          regionList={regionList} 
          roleList={roleList} 
          allUsernames={allUsernames}
          roleId={roleId}
          region={region}
        />
      </Modal>
    </div>
  )
}

