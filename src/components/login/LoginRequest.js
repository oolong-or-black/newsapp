import React from 'react'
import { Button } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { beforeLogin } from '../../redux/userSlice'

export default function LoginRequest() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div>
        <Button type="primary" onClick={()=>{
                navigate('/login')
                dispatch(beforeLogin(location.pathname))
                }}>Login
        </Button>
    </div>
  )
}
