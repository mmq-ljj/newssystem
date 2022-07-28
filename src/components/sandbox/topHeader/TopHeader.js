// 顶部
import React from 'react'
import { Layout, Dropdown, Menu, Avatar, Modal } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
// 引入connect用于连接ui组件和redux
import { connect } from 'react-redux'

const { Header } = Layout;
const { confirm } = Modal;

// 顶部组件 
function TopHeader(props) {
    // console.log(props);

    const changeCollapsed = () => {
        // console.log(props);
        props.changeCollapsed()
    }

    // 登录账号 用户数据
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))


    // 下拉菜单选项
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
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
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


const mapStateToProps = (state) => {
    return state.collapsedReducer
}

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: 'change_collapsed',
        }
    }
}


// 用connect创建并暴露容器组件
export default connect(
    // 映射状态
    // (state) => ({ isCollapsed: state.collapsedReducer.isCollapsed }),
    // 映射方法
    // {}
    mapStateToProps,
    mapDispatchToProps
)(withRouter(TopHeader))