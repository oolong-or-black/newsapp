import React,{useState, useEffect} from 'react'
import { PageHeader, Card, Col, Row, List } from 'antd'
import LoginUser from '../../components/login/LoginUser'
import LoginRequest from '../../components/login/LoginRequest'
import _ from 'lodash'
import axios from 'axios'
import { useSelector} from 'react-redux'

export default function Homepage() {  
  const [ datalist, setDatalist] = useState([])
  const {user } = useSelector(state=>state.user)

  useEffect(()=>{
    axios.get('/news?publishState=2&_sort=publishTime&_order=desc&_expand=category').then(res=>{
      setDatalist(Object.entries(_.groupBy(res.data,item=>item.category.title)))
    })
    // setUser(localStorage.getItem('token'))
  },[])

  return (
    // avoid scrolling at the bottom, the container should be styled
    <div style={{width:'95%',margin:'0 auto'}}>
      <div className='site-page-header-ghost-wrapper'>
         <PageHeader
            className="site-page-header"         
            title='News Collection'
            subTitle='click and view'
            extra={
              user? <LoginUser/>: <LoginRequest/>             
            }
          />
      </div>

      <div className="site-card-wrapper">
        <Row gutter={[16,16]}>
          {
            datalist.map(item=>
            <Col span={8} key={item[0]}>
              <Card title={item[0]} bordered={true} hoverable={true} pagination={{number:3}}>
                <List
                  size="small"
                  pagination={{pageSize:3}}
                  dataSource={item[1]}
                  renderItem={data => 
                    <List.Item key={data.id}><a href={`#/newsdetail/${data.id}`}>{data.title}</a></List.Item>
                  }>
                </List>
              </Card>
            </Col>
          )}       
        </Row>
      </div>
    </div>
  )
}
