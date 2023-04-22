import React from 'react'
import {HashRouter, Routes, Route, Navigate} from 'react-router-dom'
import Homepage from '../views/visitors/Homepage'
import Login from '../views/login/Login'
import NewsSandbox from '../views/newsSandbox/NewsSandbox'
import SignUp from '../views/signup/SignUp'
import NewsDetail from '../views/visitors/NewsDetail'
import NotFound from '../views/others/NotFound'
import { useSelector } from 'react-redux'

export default function IndexRouter() {
  const { user } = useSelector(state=>state.user)

  return (
    <HashRouter>
        <Routes>
            <Route path='/home' element={<Homepage/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<SignUp/>} />
            <Route path='/newsdetail/:id' element={<NewsDetail/>} />
            <Route path='/' element={<Navigate to='/home'/>}/>
            <Route path='/*' element={ user==='' || user?.roleId===4 ? <NotFound/>:<NewsSandbox/>} />
        </Routes>
    </HashRouter>
  )
}
