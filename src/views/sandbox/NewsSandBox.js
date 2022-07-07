import React from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from './home/Home'
// 用户列表
import UserList from './user-manage/UserList'
// 角色列表
import RoleList from './right-manage/RoleList'
// 权限列表
import RightList from './right-manage/RightList'
// 404
import NoPermisssion from './nopermission/NoPermission'


import { Layout } from 'antd';

import './newsSandBox.scss'

const { Content } = Layout;


// 新闻发布组件
export default function NewsSandBox() {
  return (
    <Layout>
      {/* 侧边栏 */}
      <SideMenu></SideMenu>

      <Layout className="site-layout">
        {/* 顶部区域 */}
        <TopHeader></TopHeader>

        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          {/* 根据路由地址 展示 对应组件 (二级路由) */}
          <Switch>
            {/* 首页 */}
            <Route path='/home' component={Home}></Route>
            {/* 用户列表 */}
            <Route path='/user-manage/list' component={UserList}></Route>
            {/* 权限管理 - 角色列表 */}
            <Route path='/right-manage/role/list' component={RoleList}></Route>
            {/* 权限管理 - 权限列表 */}
            <Route path='/right-manage/right/list' component={RightList}></Route>
            {/* exact 精确匹配 */}
            <Redirect from='/' to='/home' exact />
            <Route path='*' component={NoPermisssion} ></Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
