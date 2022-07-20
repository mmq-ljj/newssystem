import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import Home from '../../views/sandbox/home/Home'
// 用户列表
import UserList from '../../views/sandbox/user-manage/UserList'
// 角色列表
import RoleList from '../../views/sandbox/right-manage/RoleList'
// 权限列表
import RightList from '../../views/sandbox/right-manage/RightList'
// 404
import NoPermisssion from '../../views/sandbox/nopermission/NoPermission'
// 新闻管理
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
// 审核管理
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
// 发布管理
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'


// 路由映射组件表
const LocalRouterMap = {
    // 首页
    "/home": Home,
    // 用户管理
    '/user-manage/list': UserList,  // 用户列表
    // 权限管理
    '/right-manage/role/list': RoleList, // 角色列表
    '/right-manage/right/list': RightList, // 权限列表
    // 新闻管理
    "/news-manage/add": NewsAdd,      // 撰写新闻
    "/news-manage/draft": NewsDraft,    // 草稿箱
    "/news-manage/category": NewsCategory, // 新闻分类
    "/news-manage/preview/:id": NewsPreview, // 新闻查看草稿箱
    "/news-manage/update/:id": NewsUpdate, // 新闻编辑

    // 审核管理
    "/audit-manage/audit": Audit,    // 审核新闻
    "/audit-manage/list": AuditList,     // 审核列表
    // 发布管理
    "/publish-manage/unpublished": Unpublished, // 待发布  
    "/publish-manage/published": Published,   // 已发布
    "/publish-manage/sunset": Sunset,      // 已下线
}

export default function NewsRouter() {
    const [backRouteList, setBackRouteList] = useState([])

    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then(res => {
            // console.log(res);
            setBackRouteList([...res[0].data, ...res[1].data])
            // console.log([...res[0].data, ...res[1].data]);
        })
    }, [])

    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))

    const checkRoute = (item) => {
        // 权限管理 - 权限列表里去配置该页面是否可查看
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const checkUserPermission = (item) => {
        // 当前用户的权限 是否有该路径
        return rights.includes(item.key)
    }

    return (
        <div>
            {/* 根据路由地址 展示 对应组件 (二级路由) */}
            <Switch>
                {
                    backRouteList.map(item => {
                        if (checkRoute(item) &&
                            checkUserPermission(item)) {
                            return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact></Route>
                        } else {
                            return null
                        }
                    })
                }

                {/* exact 精确匹配 */}
                <Redirect from='/' to='/home' exact />
                {
                    backRouteList.length > 0 && <Route path='*' component={NoPermisssion} />
                }
            </Switch>
        </div >
    )
}
