import React, { useEffect, useRef, useState } from 'react'
import { PageHeader, Steps, Form, Input, Button, Select, message } from 'antd'
import axios from 'axios'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw  } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function NewsAdd() {
  const [ current, setCurrent ] = useState(0)
  const [ categoryList, setCategoryList ] = useState([])
  const [ editorState, setEditorState ] = useState(null)
  const [ content, setContent ] = useState('')
  const [ formInfo, setFormInfo ] = useState(null)
  const { user } = useSelector(state=>state.user)
  const addNews = useRef()
  const navigate = useNavigate()

  useEffect(()=>{
    axios.get('/categories').then(res=>{
      setCategoryList(res.data)
    })
  },[]) 

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
      addNews.current.validateFields().then(value=>{
        setFormInfo(value)
        setCurrent(current+1)
      })
    }  else {
      if(content === 'error'){
        message.error('the content of the news could not be empty')
      } else {
        setCurrent(current+1)
      }      
    }
  }

  const handleSubmit = (auditState)=>{
    axios.post('/news',{
      ...formInfo,
      content: content,
      author: user.username,
      roleId: user.roleId,
      region: user.region? user.region:'Worldwide',
      auditState: auditState,
      publishState:0,
      createTime: Date.now(),
      view:0,
      star:0,
      comments:[],
      likedBy:[]
    })
    .then(res=>{
      navigate(auditState? '/audit-manage/list':'/news-manage/draft')
    })
  }
  
  return (
    <div>
      <PageHeader title='To Add a news'>
        <Steps current={current} items={items} />
      </PageHeader> 

      <div style={{miniHeight:'100px', margin:'30px 0'}}>         
        <Form name='add news' labelCol={{span:4}} ref={addNews} style={{display:current?'none':''}}>
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
              if(convertToRaw(editorState.getCurrentContent()).blocks.filter(item=>item.text.trim()!=='').length===0){
                setContent('error')
              } else{
                setContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
              }
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

// import draftToHtml from 'draftjs-to-html'
// setContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
