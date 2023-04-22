import { Descriptions, PageHeader } from 'antd'
import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

export default function NewsPreview() {
  const [ newsInfo, setNewsInfo ] = useState(null)
  const {id} = useParams() 
  const auditStatus = ['Audit pending', 'Audit in progress','Audit approved', 'Audit declined']  
  const publishStatus = ['Unpublished','Published','Sunset']

  useEffect(()=>{
    axios.get(`/news/${id}?_expand=category`).then(res=>{
      setNewsInfo(res.data)
    })
  },[id])

  return (
    newsInfo &&  <> 
      <PageHeader
        onBack={()=>window.history.back()}
        title={newsInfo.title}
        subTitle={newsInfo.category.title}
      >
        <Descriptions column={3}>
        <Descriptions.Item label='Author'>{newsInfo.author}</Descriptions.Item>
        <Descriptions.Item label='Created Time'>{moment(newsInfo.createTime).format('DD/MM/YYYY HH:mm:ss')}</Descriptions.Item>
        <Descriptions.Item label='Published Time'>{newsInfo.publishTime? moment(newsInfo.PublishTime).format('DD/MM/YYYY HH:mm:ss'):'-'}</Descriptions.Item>
        <Descriptions.Item label='Region'>{newsInfo.region}</Descriptions.Item>
        <Descriptions.Item label='Audit Status'>{auditStatus[newsInfo.auditState]}</Descriptions.Item>
        <Descriptions.Item label='Publish Status'>{publishStatus[newsInfo.publishState]}</Descriptions.Item>
        <Descriptions.Item label='Views'>{newsInfo.view}</Descriptions.Item>
        <Descriptions.Item label='Likes'>{newsInfo.star}</Descriptions.Item>
        <Descriptions.Item label='Comments'>{newsInfo.comments.length}</Descriptions.Item>
        </Descriptions>  
      </PageHeader>

      <div style={{border:'1px solid rgba(155,155,155,.3)',marginTop:'20px',minHeight:'200px', padding:'25px'}} dangerouslySetInnerHTML={{ __html:newsInfo.content }}/>       
    </>
  )
}
