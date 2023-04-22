import React, { useEffect, useRef, useState } from 'react'
import { PageHeader, Steps, Form, Input, Button, Select, message, notification } from 'antd'
import axios from 'axios'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useNavigate, useParams } from 'react-router-dom'
import htmlToDraft from 'html-to-draftjs'

export default function NewsUpdate() {
  const [ current, setCurrent ] = useState(0)
  const [ categoryList, setCategoryList ] = useState([])
  const [ editorState, setEditorState ] = useState(null)
  const [ content, setContent ] = useState('')
  const [ formInfo, setFormInfo ] = useState(null)
  const [ Status, setStatus ] = useState(null)
  const updateNews = useRef()
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(()=>{
    axios.get('/categories').then(res=>{
      setCategoryList(res.data)
    })
  },[]) 

  useEffect(()=>{
    axios.get(`/news/${id}`).then(res=>{
      setStatus(res.data.auditState)
      updateNews.current.setFieldsValue({
        title: res.data.title,
        categoryId: res.data.categoryId
      })
      let contentState= ContentState.createFromBlockArray(htmlToDraft(res.data.content))
      setEditorState(EditorState.createWithContent(contentState))
      setContent(res.data.content)
    })
  },[id])

  const items = [
    {
      title: 'Basic Info',
      description:'Title & Category'
    },
    {
      title: 'News Content',
      description:'Content of the news'
    },
    {
      title: 'Submit',
      description:'to Drafts or Audits'
    }
  ]

  const handleNext = ()=>{
    if(current===0){
      updateNews.current.validateFields().then(value=>{
        setFormInfo(value)
        setCurrent(current+1)
      })
    }  else {
      if(content ==='' || content === '<p></p>'){
        message.error('the content of the news could not be empty')
      } else {
        setCurrent(current+1)
      }      
    }
  }

  const handleSubmit = (auditState)=>{
    axios.patch(`/news/${id}`,{
      ...formInfo,
      content: content,
      auditState: auditState,
    })
    .then(res=>{
      navigate(Status? '/audit-manage/list':'/news-manage/draft')
      if(auditState===1){
        notification.info({
          message:'Notification:',
          description:'You can check the just updated news in the Audit-list',
          placement:'top'
        })
      }
    })
  }
  
  return (
    <div>
      <PageHeader title='To Add a news'>
        <Steps current={current} items={items} />
      </PageHeader>

      <div style={{miniHeight:'100px', margin:'30px 0'}}>
        <Form name='update news' labelCol={{span:4}} ref={updateNews} style={{display: current===0? '':'none'}}>
          <Form.Item 
            label='News Title' 
            name='title'
            rules={[{required: true, message:'The news must have a title'}]}>
            <Input/>
          </Form.Item>
          <Form.Item 
            label='News Category' 
            name='categoryId'
            rules={[{required: true, message:'The news must select a category'}]}>
            <Select 
              options={categoryList.map(item=>({label:item.title, value:item.id}))}
            />
          </Form.Item>
        </Form>

        {
          current === 1 &&
           <Editor
            editorState={editorState}
            onEditorStateChange={(editorState)=>setEditorState(editorState)}
            onBlur={()=>{ 
              setContent('<p>'+convertToRaw(editorState.getCurrentContent()).blocks[0].text.trim()+'</p>')
            }}
          />
        }
      </div>

      <div>
        {current !==0 && <Button style={{marginRight:'15px'}} onClick={()=>{setCurrent(current-1)}}>Previous</Button>}
        {current !==2 && <Button style={{width:'85px'}} type='primary' onClick={handleNext}>Next</Button>}
        {current ===2 && <span>
          <Button type='primary' style={{marginRight:'15px'}} onClick={()=>handleSubmit(0)}>Save to Drafts</Button> 
          <Button danger onClick={()=>handleSubmit(1)}>Submit to Audit</Button>
        </span>}
      </div>
    </div>
  )
}
