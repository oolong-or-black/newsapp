import React from 'react'
import NewsPublish from '../../../components/publish-management/NewsPublish'
import { useSelector } from 'react-redux'

export default function Sunset() {
  const { user:{username }} = useSelector(state=>state.user)

  return (
    <NewsPublish publishState={3} username={username}/>
  )
}
