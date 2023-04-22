import React, { useEffect, useState } from 'react'
import { Button, Form, Input } from 'antd'
import axios from 'axios'

export default function Register() {
  const [ allUsers, setAllUsers ] = useState([])

  useEffect(()=>{
    axios.get('/users').then(res=>{
      setAllUsers(res.data.username)
    })
  },[])

  const checkUsername =  (_, value)=>{
    if(allUsers.includes(value)){
      Promise.reject(new Error('This username has already existed !'))
    }
    return Promise.resolve()
  }    

  const onFinish = (values) => {
    console.log('Success:', values);
  }

  return (
    <Form name='Registration' labelCol={{span:5}} onFinish={onFinish}>
      <Form.Item
        label='Username'
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
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
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
        <Button type='primary'>Submit</Button>
      </Form.Item>
    </Form>
  ) 
}
