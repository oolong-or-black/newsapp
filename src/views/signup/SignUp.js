import React, { useEffect, useState } from 'react'
import { Button, Form, Input } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { login } from '../../redux/userSlice'

export default function SignUp() {
  const [ allUsers, setAllUsers ] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentPath } = useSelector(state=>state.user)
  
  useEffect(()=>{
    axios.get('/users').then(res=>{
      setAllUsers(res.data.map(item=>item.username))
    })
  },[])

  const checkUsername =  (_, value)=>{
    if(allUsers.includes(value)){
      Promise.reject(new Error('This username has already existed !'))
    }
    return Promise.resolve()
  }    

  const onFinish = (values) => {
    axios.post('/users',{
      username:values.username,
      password:values.password,
      roleId:4,
      roleState:true
    }).then(res=>{
      localStorage.setItem('token',JSON.stringify(res.data)) 
      dispatch(login()) 
    })
    navigate(`${currentPath}`) 
    console.log('Success:', values);
  }

  return <div style={{background:'rgba(35,39,60)',height:'100%'}}>
    <div className='FormWrapper'>
      <Form name='Registration' labelCol={{span:6}} onFinish={onFinish} style={{marginTop:50,textAlign:'center'}}>
        <Form.Item
          label={<span style={{color:'white',fontSize:'18px'}}>Username</span>}
          name='username'
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
            {
              validator: checkUsername
            }
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label={<span style={{color:'white',fontSize:'18px'}}>Password</span>}
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType="submit" block={true}>Sign Up</Button>
        </Form.Item>
      </Form>
    </div>
  </div>
}
