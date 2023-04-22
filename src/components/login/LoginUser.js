import React from 'react'
import { Avatar, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux'
import { logout } from '../../redux/userSlice'
import { useNavigate } from 'react-router-dom';

export default function LoginUser() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.user)

    const { username } = user
    const Logout = ()=>{
        if(user.roleId!==4){
            navigate('/login')
        }
        dispatch(logout())
        localStorage.removeItem('token')
    }
    const Administrate = ()=>{
        navigate('/backstage')
    }
    const items=[
            {
                key: '1',
                label: username,
            },
            {
                key: '2',
                label: user.roleId===4? '':'Backstage',
                onClick: user.roleId===4? null:Administrate
            },
            {
                key: '3',
                label: 'Logout',
                danger:true,
                onClick:Logout
            },
        ]
           
  return (
    <div style={{float:'right'}} className='LOGIN'>    
        <span style={{margin:'0 5px'}} > Welcome back! </span>
        <Dropdown menu={{items}}>
            { user.roleId === 4? <Avatar style={{ backgroundColor:'#87d068'}} icon={<UserOutlined />} />:<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=random" />}
        </Dropdown>  
                   
    </div> 
  )
}
