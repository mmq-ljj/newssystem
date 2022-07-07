// 顶部
import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
const { Header } = Layout;


// 
export default function SideMenu() {
    const [collapsed, setCollapsed] = useState(false);
    const changeCollapsed = () => {
        setCollapsed(!collapsed)
    }

    // 下来菜单选项
    const menu = (
        <Menu items={
            [{
                key: '1',
                label: '超级管理员',
            }, {
                key: '4',
                danger: true,
                label: '退出登录',
            },]
        } />
        // <Menu>
        //     <Menu.Item>超级管理员</Menu.Item>
        //     <Menu.Item>退出</Menu.Item>
        // </Menu>
    );

    return (
        <Header
            className="site-layout-background"
            style={{ padding: '0 16PX' }}
        >
            {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
            })} */}
            {
                collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }

            <div style={{ float: 'right' }}>
                <span>welcome  back</span>
                <Dropdown overlay={menu}>
                    <Avatar size={32} icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
