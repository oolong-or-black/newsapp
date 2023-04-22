import React, { useEffect, useState } from 'react'
import { Avatar, Button, Comment, Form, Input, List } from 'antd'
import moment from 'moment'
import axios from 'axios'

const { TextArea } = Input

export default function NewsComments(props){
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const [ commentList, setCommentList] = useState([])
  
  useEffect(()=>{
    axios.get(`/news/${props.id}`).then(res=>{
      setCommentList(res.data.comments)
    })
  },[props.id])

  // when writing the comment
  const handleChange = (e) => {
    setValue(e.target.value)
  }

  // when submit the new-added comment
  const handleSubmit = () => {
    // if the new-added comment is blank
    if (!value) return;
    // if the new-added comment is not blank, it is ok to be submit
      // change the status of submit loading
    setSubmitting(true);
      // after submit
    let newList = [...commentList]
    newList.unshift({
      author: props.username,
      content: value,
      commentTime: Date.now()    
    })
    setTimeout(() => {
      // restore the initial-status of submit loading
      setSubmitting(false);
      // clear the textare
      setValue('');
      // push the new-added comment into comment list
      setCommentList(newList)      
    }, 1000);
    axios.patch(`/news/${props.id}`,{
      comments:newList
    })
    // let the 'newsdetail' page update the comments description
    props.addComment()
  }

  return (
    <>
      {/* show the previous comments   */}
      {
        commentList.length === 0? <div style={{margin:'5px 40px'}}> No comments.</div> :
        // commentList.map(item=><li key={item.commentTime}>{item.content}</li>)
        <List
          dataSource={commentList}
          pagination={{pageSize:5}}
          renderItem={ item =>
            <List.Item key={item.commentTime}>              
              <Comment
                author={<span>{item.author}</span>}
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt={item.author}/>}
                content={item.content}
                datetime={moment(item.commentTime).format('DD/MM/YYYY HH:mm:ss')}
              />
            </List.Item>
          }
        />
      }  

      {/* add a new comment */}
      {/* {props.username && */}
        <Comment
          avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
          content={
            <>
              <Form.Item>
              <TextArea rows={4} placeholder={props.username? '':'Please login to make a comment.'} onChange={handleChange} value={value} disabled={props.username? false:true}/>
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" loading={submitting} onClick={handleSubmit} type="primary">
                  Add Comment
                </Button>
              </Form.Item>
          </>
          }
        />
      {/* } */}
    </>
  )
}
