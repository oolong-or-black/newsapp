import React, { useCallback } from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Particles from 'react-tsparticles'
import { loadFull } from "tsparticles"
import './Login.css'

import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/userSlice'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentPath } = useSelector(state=>state.user)

  // when press LOGIN button
  const onFinish = (values)=>{
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
      .then(res=>{
        if(res.data.length ===0 ){
          // login failed
          message.info('username or password does not match')
        } else {
          // login success
          localStorage.setItem('token', JSON.stringify(res.data[0]))
          dispatch(login())
          if(res.data[0].roleId === 4){
            // visitors go to the previous viewing page
            navigate(`${currentPath}`)
          } else {
            // administrators go to the backstage
            navigate('/backstage')
          }
        }
      })
  }

  // set up the particles background
  const particlesInit = useCallback(async (engine) =>{
    await loadFull(engine)
  },[])
  const particlesLoaded = useCallback(async (container) => {
  }, [])
  const options = {  
    interactivity:{
      events:{
        onClick:{
          enable: true,
          mode: "push"
        },
        onHover:{
          enable: true,
          mode: "bubble",
          parallax:{
            force:60
          }
        }
      },   
      modes:{
        bubble:{
          distance: 400,
          duration: 2,
          opacity: 1,
          size: 40
        },
        grab: {
          distance: 400
        }
      }
    },  
    particles:{
      color: {
        value: '#fff'
      },
      links: {
        color: {
          value: '323031'
        },
        distance: 150,
        opacity: 0.4
      },
      move: {
        attract: {
          rotate:{
            x: 600,
            y: 1200
          }
        },
        enable: true,
        outModes: {
          default: 'bounce',
          bottom: 'bounce',
          left: 'bounce',
          right: 'bounce',
          top: 'bounce'
        },
        speed: 2
      },
      number: {
        density:{
          enable: true
        },
        value: 30
      },
      opacity:{
        animation: {
          speed: 2,
          minimumValue: 0.1
        }
      },
      shape:{
        options:{
          character:{
            fill: false,
            font: 'Verdana',
            style: '',
            value: '*',
            weight: 400
          },
          char:{
            fill: false,
            font: 'Verdana',
            style: '',
            value: '*',
            weight: 400
          },       
          polygon: {
            nb_sides: 5
          },  
          star: {
            nb_sides: 5
          },  
          image:{
            height: 32,
            replace_color: true,
            src: '/logo192.png',
            width: 32
          },     
          images:{
            height: 32,
            replace_color: true,
            src: '/logo192.png',
            width: 32
          }    
        },
        type: 'image'
      },
      size: {
        value: 16,
        animation: {
          speed: 10,
          minimumValue: 0.1
        }
      },
      stroke:{
        color: {
          value: '#000',
          animation:{
            h: {
              count: 0,
              enable: false,
              offset: 0,
              speed: 1,
              sync: true
            },
            s: {
              count: 0,
              enable: false,
              offset: 0,
              speed: 1,
              sync: true
            },
            1: {
              count: 0,
              enable: false,
              offset: 0,
              speed: 1,
              sync: true
            }
          }
        }
      }  
    }   
  }

  return (
    <div style={{background:'rgba(35,39,60)', height:'100%'}}>
      <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded} options={options}/>   
      <div className='FormWrapper' >
        <Form
          name="login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label={<span style={{color:'white', fontSize:'18px'}}>Username</span>}
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        
          <Form.Item
            label={<span style={{color:'white', fontSize:'18px'}}>Password</span>}
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        
          <Form.Item
            name="remember"
            valuePropName="checked"            
          >
            <Checkbox><span style={{color:'white'}}>Remember me</span></Checkbox>
          </Form.Item>
        
          <Form.Item >
            <Button type="primary" htmlType="submit"  block={true}>
              LOGIN
            </Button>
          </Form.Item>
        </Form>

        <p style={{textAlign:'center'}}>
          New to News Collection? <a style={{color:'grey',marginLeft:'5px'}} href='#/signup'> Create an account</a>
        </p>
        
      </div>      
    </div>
  )
}

/*

*/