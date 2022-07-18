import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../../views/sandbox/home/Home'
// 用户列表
import UserList from '../../views/sandbox/user-manage/UserList'
// 角色列表
import RoleList from '../../views/sandbox/right-manage/RoleList'
// 权限列表
import RightList from '../../views/sandbox/right-manage/RightList'
// 404
import NoPermisssion from '../../views/sandbox/nopermission/NoPermission'

export default function NewsRouter() {
    return (
        <div>
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
        </div>
    )
}
