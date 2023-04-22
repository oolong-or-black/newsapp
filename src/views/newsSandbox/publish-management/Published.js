import React from 'react'
import { useSelector } from 'react-redux'
import NewsPublish from '../../../components/publish-management/NewsPublish'

export default function Published() {
  const { user:{username }} = useSelector(state=>state.user)
  return (
    <NewsPublish publishState={2} username={username}/>
  )
}
