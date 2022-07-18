import React from 'react'
import SideMenu from '../../components/sandbox/sideMenu/SideMenu'
import TopHeader from '../../components/sandbox/topHeader/TopHeader'
import NewsRouter from '../../components/newsRouter/NewsRouter'

import { Layout } from 'antd'
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
          {/* 内容展示的路由组件 */}
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
