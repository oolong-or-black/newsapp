import React, { forwardRef } from 'react'
import { Form, Input, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { DisableOff, DisableOn  } from '../../redux/disableSlice'

const { Option } = Select
const UserForm = forwardRef((props,ref)=>{
  const dispatch = useDispatch() 
  const { isDisabled } = useSelector(state=>state.disable)
  const { regionList, roleId, roleList, region, allUsernames, targetUser } = props

  const isSelectDisable = (data)=>{
    if (roleId ===1 ){
      return false
    } else {
      if(typeof(data) =='string'){
        return data === region? false:true
      } else {
        return data>roleId? false:true
      }
    }   
  }

  const selectRole = (e)=>{
    if(e===1){
      ref.current.setFieldsValue({
        region:''
      })
      dispatch(DisableOn())
    } else {
      dispatch(DisableOff())
    }
  }

  const checkUsername = (_, value) =>{  
    if( allUsernames.includes(value) && value !== targetUser?.username ){
      return Promise.reject(new Error('This username has already existed !'))
    }   
    return Promise.resolve()
  }

  return (
    <Form ref={ref} layout='vertical'>
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { 
            required: true,
            message: 'username must not be blank'
          },
          {
            validator: checkUsername
          }
        ]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{required: true}]}
        >
        <Input.Password />
      </Form.Item>
    
      <Form.Item
        label="Region"
        name="region"
        rules={[{required: !isDisabled}]}  
        >
        {/* <Select disabled={isDisabled} options={props.regionList} onChange={()=>{}}/>*/}
        <Select disabled={isDisabled} onChange={()=>{}}>
          {
            regionList.map(item=>
              <Option value={item.value} key={item.id} disabled={ isSelectDisable(item.title)}>
                {item.title}
              </Option>
            )  
          }
        </Select>
      </Form.Item>

      <Form.Item
        label="Role"
        name="roleId"
        rules={[{required: true}]}
        >
        <Select onChange={selectRole}>
          {
            roleList.map(item=>
              <Option key={item.id} value={item.id} disabled={isSelectDisable(item.id)}>{item.roleName}</Option>)
          }
        </Select>
      </Form.Item>
    </Form>
  )
})

export default UserForm