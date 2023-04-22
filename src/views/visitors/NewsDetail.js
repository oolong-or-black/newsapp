import React,{useState, useEffect} from 'react'
import { Descriptions, PageHeader, Button, Popover} from 'antd'
import { HeartTwoTone, HeartFilled, getTwoToneColor, setTwoToneColor } from '@ant-design/icons'
import axios from 'axios'
import LoginUser from '../../components/login/LoginUser'
import LoginRequest from '../../components/login/LoginRequest'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useSelector} from 'react-redux'

import NewsComments from '../../components/news-management/NewsComments'

export default function NewsDetail() {
  const [ newsInfo, setNewsInfo] = useState(null)
  const [ isLiked, setIsLiked] = useState(null)
  const [ isDisabled, setIsDisabled ] = useState(true)  
  const { id } = useParams()
  const { user } = useSelector(state => state.user)
  // const user = JSON.parse(localStorage.getItem('token')) Don't know why it will cause unexpected problems
  const [ commentAdd, setCommentAdd ] = useState(0)

  useEffect(()=>{
    axios.get(`/news/${id}?_expand=category`).then(res=>{
      setNewsInfo({
        ...res.data,
        view: res.data.view+1
      })

        return res.data
      }).then(res=>{
        axios.patch(`/news/${id}`,{
          view: res.view+1
        }) 
        
        // if this news is already liked by the  current login-user
        if(user && res.likedBy.includes(user.username)) {
          setIsLiked(true)
        }
    })
    // if the current visitor is a login user
    if(user){
      setIsDisabled(false)
      setTwoToneColor("#eb2f96")
    } else {
      setIsDisabled(true)
      setTwoToneColor("#e1e1e1")
    }
  },[id,user])

  const handleLike = ()=>{
    var newLikes = [...newsInfo.likedBy]
    var n = newsInfo.likedBy.indexOf(user.username)
    if(newsInfo.likedBy.includes(user.username)){
      //the current login-user changes its mind to dislike the news it liked before
      newLikes.splice(n,1)
      setIsLiked(false)
      setNewsInfo({
        ...newsInfo,
        star: newsInfo.star-1,
        likedBy: newLikes
      })
      axios.patch(`/news/${id}`,{
        star: newsInfo.star-1,
        likedBy: newLikes
      })
      // console.log(isLiked)
    } else {
      //the current login-user likes this news
      setIsLiked(true) 
      newLikes.push(user.username)
      setNewsInfo({
        ...newsInfo,
        star:newsInfo.star+1,
        likedBy: newLikes
      })
      axios.patch(`/news/${id}`,{
        star: newsInfo.star+1,
        likedBy: newLikes
      })
    }
    console.log(newLikes)
  }

  return (
    <div>
      {
        newsInfo &&  
        <div className="site-page-header-ghost-wrapper">
          <PageHeader
            onBack={() => window.history.back()}
            title = {newsInfo.title}
            subTitle= {newsInfo.category.title}
            extra={user? <LoginUser/>:<LoginRequest />}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="Author">{newsInfo.author}</Descriptions.Item>    
              <Descriptions.Item label="Published Time">{ moment(newsInfo.publishTime).format('DD/MM/YYYY HH:mm:ss')}</Descriptions.Item>    
              <Descriptions.Item label="Region">{newsInfo.region}</Descriptions.Item>    
              <Descriptions.Item label="Visited">{newsInfo.view}</Descriptions.Item>    
              <Descriptions.Item label="Like">
                {<div>
                  <span style={{marginRight:'15px'}}>{newsInfo.star}</span>
                  <Popover content={'Please login first!'} trigger={isDisabled? 'hover':"null"}>
                    <Button shape="circle" size="small" onClick={handleLike} disabled={isDisabled}>
                      {
                        isLiked ? <HeartFilled style={{color:'#eb2f96'}}/> : <HeartTwoTone twoToneColor={getTwoToneColor()}/>
                      }  
                    </Button>
                  </Popover>  
                </div>}
              </Descriptions.Item>    
              <Descriptions.Item label="Comments">{newsInfo.comments.length+commentAdd}</Descriptions.Item>    
            </Descriptions>          
          </PageHeader>         

          <div style={{margin:'20px'}} dangerouslySetInnerHTML={{
            __html:newsInfo.content
          }}>            
          </div>          
          <NewsComments username={user? user.username:'' } id={id} addComment={()=>{setCommentAdd(commentAdd+1)}}/>  
        </div>
      }
    </div>
  )
}
