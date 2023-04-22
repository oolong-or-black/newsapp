import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
const { Sider }=Layout

export default function SideMenu() {
  const [ menuList, setMenuList ] = useState([])
  const { isCollapsed } = useSelector(state=>state.collapse)
  const { user}  = useSelector(state=>state.user)
  const navigate = useNavigate()
  const {pathname} = useLocation()

  useEffect(()=>{
    axios.get('/rights?_embed=children').then(res=>{
      setMenuList(res.data.filter(item=>user.role.rights.includes(item.key) && item))
    })
  },[user])

  const items = menuList.map(item =>{
    let children = item.children.filter(data=>data.pagepermission === 1)
    return{      
      'label':item.title,
      'key':item.key,
      'children': children.length===0? null:
        children.map(data=>{
          if(user.role.rights.includes(data.key)){
            return {
              'label': data.title,
              'key': data.key
            }
          } else {
            return null
          }
      }) 
    }
  })

  return (
    <Sider trigger={null} collapsible collapsed={isCollapsed} >
      <div style={{ height: '100%', display:'flex',flexDirection:'column'}}>
        <div className="logo">News Collection Backstage Management</div>
        <div style={{flex:1, overflow:'auto'}}>
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={['/'+pathname.split('/')[1]]}
            selectedKeys={pathname}
            items={items}
            onClick={(item)=>{
              navigate(item.key)
            }}
          />
        </div>
      </div>
     </Sider> 
  )
}