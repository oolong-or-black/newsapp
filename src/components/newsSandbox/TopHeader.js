import React, { useEffect, useState } from 'react'
import { Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons' 
import { handleCollapse } from '../../redux/collapseSlice' 
import LoginRequest from '../login/LoginRequest' 
import LoginUser from '../login/LoginUser' 
import axios from 'axios'
import { useLocation } from 'react-router-dom'

const { Header} = Layout
export default function TopHeader() {
  const [ list, setList ] = useState([])
  const dispatch = useDispatch()
  const { isCollapsed } = useSelector(state => state.collapse)
  const { pathname } = useLocation()
  
  useEffect(()=>{
   Promise.all([
    axios.get('/rights'),
    axios.get('/children')
   ]).then(res=>{
    setList([...res[0].data, ...res[1].data]) 
   })
  },[])

  const getTitle =()=>{
    let Title = ''
    if(pathname.includes('/news-manage/preview/')){
      Title='News Preview'
    } else {
      if(pathname.includes('/news-manage/update/')){
        Title = 'News Update'
      } else {
        Title = list.filter(item=>item.key===pathname)[0]?.title
      }
    }
    return Title
  }  

  return (
    <div>
      <Header  className="site-layout-background" style={{ padding:'0 30px'}}>
        {
          React.createElement(isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => dispatch(handleCollapse(!isCollapsed))})
        }
        <b style={{margin:'0 10px'}} onClick={()=>{console.log(list,pathname)}}>
          { getTitle() }
        </b>
        <div style={{float:'right'}}>
          {localStorage.getItem('token')? <LoginUser/>: <LoginRequest/>}
        </div>
      </Header>
    </div>
  )
}




