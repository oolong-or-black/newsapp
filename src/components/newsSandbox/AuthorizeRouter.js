import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from '../../views/others/NotFound'
import Overview from '../../views/newsSandbox/overview/Overview'
import UserList from '../../views/newsSandbox/users-management/UserList'
import RoleList from '../../views/newsSandbox/right-management/RoleList'
import RightList from '../../views/newsSandbox/right-management/RightList'
import NewsAdd from '../../views/newsSandbox/news-management/NewsAdd'
import NewsDraft from '../../views/newsSandbox/news-management/NewsDraft'
import NewsCategory from '../../views/newsSandbox/news-management/NewsCategory'
import NewsPreview from '../../views/newsSandbox/news-management/NewsPreview'
import NewsUpdate from '../../views/newsSandbox/news-management/NewsUpdate'
import Audit from '../../views/newsSandbox/audit-management/Audit'
import AuditList from '../../views/newsSandbox/audit-management/AuditList'
import Unpublished from '../../views/newsSandbox/publish-management/Unpublished'
import Published from '../../views/newsSandbox/publish-management/Published'
import Sunset from '../../views/newsSandbox/publish-management/Sunset'

export default function AuthorizeRouter() {
  const {user:{role}} = useSelector(state=>state.user)
  // const {user:{username}} = useSelector(state=>state.user)

  const RoutesMap = {
    "/overview": <Overview/>,
    "/user-manage/list": <UserList/>,
    "/right-manage/role/list": <RoleList/>,
    "/right-manage/right/list": <RightList/>,
    "/news-manage/add": <NewsAdd/>,
    "/news-manage/draft": <NewsDraft/>,
    "/news-manage/category": <NewsCategory/>,
    "/news-manage/preview/:id": <NewsPreview/>,
    '/news-manage/update/:id': <NewsUpdate/>,
    "/audit-manage/audit": <Audit/>,
    "/audit-manage/list": <AuditList/>,
    "/publish-manage/unpublished": <Unpublished/>,
    "/publish-manage/published": <Published/>,
    "/publish-manage/sunset": <Sunset/>,
    "/backstage": <Navigate to='/overview' />
  }


  return (
    <Routes>
      {
        role.rights.map(item=>{
          if(Object.keys(RoutesMap).includes(item)){
            return <Route path={item} element={RoutesMap[item]} key={item}/>
          } 
          return null
        })
      }
      <Route path='/backstage' element={<Navigate to='/overview'/>}/>
      <Route path='*' element={<NotFound/>}/>
    </Routes>
  )
}
