import React, { useEffect } from 'react'
import { Layout, Menu } from 'antd';
import axios from 'axios'
import './sideMenu.scss'
import { connect } from 'react-redux'

// 1.withRouter高阶组件 包裹低阶组件
// 2.可以通过withRouter拿到history属性
import { withRouter } from 'react-router-dom';

import {
    MailOutlined,
    // SettingOutlined,
    HomeOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
// import './index.css'
const { Sider } = Layout;


// console.log(style);

// 图标数组
const iconList = {
    // 首页
    "/home": <HomeOutlined />,
    // 用户管理
    '/user-manage': <AppstoreOutlined />,
    '/user-manage/list': <AppstoreOutlined />,
    // 权限管理
    '/right-manage': <AppstoreOutlined />,
    '/right-manage/role/list': <AppstoreOutlined />,
    '/right-manage/right/list': <AppstoreOutlined />,
    // 新闻管理
    '/news-manage': <AppstoreOutlined />,
    '/news-manage/add': <AppstoreOutlined />,
    '/news-manage/draft': <AppstoreOutlined />,
    '/news-manage/category': <AppstoreOutlined />,
    // 审核管理
    "/audit-manage": <AppstoreOutlined />,
    '/audit-manage/audit': <AppstoreOutlined />,
    '/audit-manage/list': <AppstoreOutlined />,
    // 发布管理
    "/publish-manage": <AppstoreOutlined />,
    '/publish-manage/unpublished': <AppstoreOutlined />,
    '/publish-manage/published': <AppstoreOutlined />,
    '/publish-manage/sunset': <AppstoreOutlined />,
}

// 侧边导航栏组件
function SideMenu(props) {
    // console.log(props);
    const [menuList, setMenList] = React.useState([])

    // 该用户的路由权限
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    // console.log(rights);

    useEffect(() => {
        getMenuList()
        return () => { }
    }, []) //eslint-disable-line

    // 获取侧边导航栏
    const getMenuList = () => {
        axios.get('/rights?_embed=children').then(res => {
            // console.log(res.data);
            const resList = res.data
            // console.log(resList);
            const menuData = handleMenuData(resList)
            // console.log(menuData);
            setMenList(menuData)
            // console.log(menuData);
        })
    }

    // 处理侧边导航栏数据
    const handleMenuData = (resList) => {
        // console.log(resList);
        resList = resList.map(menu => {
            // console.log(menu);
            // 1 为页面权限
            // && rights.includes(menu.key)
            if (menu.pagepermisson === 1 && rights.includes(menu.key)) {
                // console.log(menu);
                const obj = {}
                // 标题
                obj.label = menu.title
                // 路径
                obj.key = menu.key
                // 通过递归处理 子菜单
                // if (menu.children && menu.children.length !== 0) {
                if (menu.children?.length > 0) {
                    obj.children = handleMenuData(menu.children)
                }
                // 跳转方法
                if (!menu.children || menu.children.length === 0) {
                    obj.onClick = () => {
                        // console.log(obj.key);
                        props.history.push(obj.key)
                    }
                }
                // 图标
                obj.icon = iconList[menu.key]
                return obj
            }
        })
        return resList
    }

    // console.log(props);
    const items = [
        {
            label: '权限管理',
            key: '/right-manage',
            icon: <AppstoreOutlined />,
            children: [{
                label: '角色列表',
                key: '/right-manage/role/list',
                icon: <MailOutlined />,
                onClick: () => {
                    props.history.push('/right-manage/role/list')
                },
            }]
        }
    ]

    // console.log(props.location);
    // 默认选中项
    const selectKeys = [props.location.pathname]
    // console.log(selectKeys);
    // const selectKeys = props.location.pathname === '/' ? ['/home'] : [props.location.pathname]

    // 默认展开项
    const openKeys = ['/' + props.location.pathname.split('/')[1]]
    // console.log(openKeys);

    return (
        // collapsed 侧边栏折叠状态
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div className='leftArea'>
                <div className="logo">新闻发布平台</div>
                <div className='leftMenu'>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={selectKeys}
                        defaultOpenKeys={openKeys}
                        items={menuList}
                    />
                </div>
            </div>
        </Sider>
    )
}


// const mapStateToProps = (state) => {
//     return state.collapsedReducer
// }


export default connect(
    (state) => ({ isCollapsed: state.collapsedReducer.isCollapsed }),
    // (state) => { console.log(state); },
)(withRouter(SideMenu))
