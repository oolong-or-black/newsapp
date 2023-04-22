import React from 'react' 
import { Layout } from 'antd' 
import TopHeader from '../../components/newsSandbox/TopHeader'
import SideMenu from '../../components/newsSandbox/SideMenu'
import './NewsSandbox.css'
import AuthorizeRouter from '../../components/newsSandbox/AuthorizeRouter'

const { Content } = Layout 
export default function NewsSandbox() {
  

  return (
    <Layout >
      <SideMenu/>
      <Layout className="site-layout">
        <TopHeader/>
        <Content className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow:'auto'
          }}
        >
          <AuthorizeRouter/>
        </Content>
      </Layout>
    </Layout>  
  )
}
