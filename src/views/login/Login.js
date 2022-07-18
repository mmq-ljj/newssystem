import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import './login.scss'
// import Particles from 'react-particles-js';
import axios from 'axios';

export default function login(props) {
  // login是路由组件,所以他的props有值
  // console.log(props);

  // 登录表单 确定回调
  const onFinish = (values) => {
    // console.log(values);
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
      .then(res => {
        // console.log(res);
        if (res.data.length !== 0) {
          // console.log(res.data[0]);
          localStorage.setItem('token', JSON.stringify(res.data[0]))
          props.history.push('/')
          message.success('登录成功')
        } else {
          message.error('用户名或密码错误！')
        }
      })
  };

  return (
    <div style={{ background: '#b2bec3', height: "100%" }}>
      {/* <Particles /> */}

      <div className='form_container'>
        {/* <div className='login_title'>全球新闻发布系统</div> */}
        {/* 登录表单 */}
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true, }}
          onFinish={onFinish}
        >
          {/* 用户名 */}
          <Form.Item
            name="username"
            rules={[{
              required: true,
              message: 'Please input your Username!',
            },]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username"
            />
          </Form.Item>

          {/* 密码 */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
