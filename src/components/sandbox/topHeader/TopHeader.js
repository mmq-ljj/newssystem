// 顶部
import React, { useEffect, useState } from 'react'
import { Layout, Dropdown, Menu, Avatar, Modal } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';

const { Header } = Layout;
const { confirm } = Modal;

// 顶部组件 
function TopHeader(props) {
    const [collapsed, setCollapsed] = useState(false);
    const changeCollapsed = () => {
        setCollapsed(!collapsed)
    }

    // 登录账号 用户数据
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))

    // console.log(userInfos);

    // 
    // useEffect(() => {
    //     // localStorage.getItem('token')
    // }, [])




    // 下来菜单选项
    const menu = (
        <Menu items={[
            {
                key: '1',
                label: roleName,
            },
            {
                key: '4',
                danger: true,
                label: <div onClick={() => { logOut() }}>退出</div>,
            },
        ]}
        />
        // <Menu>
        //     <Menu.Item>超级管理员</Menu.Item>
        //     <Menu.Item>退出</Menu.Item>
        // </Menu>
    );

    // 退出登录
    const logOut = () => {
        confirm({
            title: '退出系统，是否继续',
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            cancelText: '取消',
            // content: 'Some descriptions',
            onOk() {
                localStorage.removeItem("token")
                props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel');
            },
        });
        // console.log(props);

    }

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
                <span style={{ marginRight: '5px' }}>欢迎 <span style={{ color: "#1890ff" }}>{username}</span>  回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size={32} icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
export default withRouter(TopHeader) 