import React from 'react'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'

export default function indexRouter() {
    return (
        <Router>
            <Switch>
                <Route path='/login' component={Login} />
                {/* <Route path='/' component={NewsSandBox} /> */}
                <Route path='/' render={() =>
                    // 本地里有无 token
                    localStorage.getItem('token') ?
                        <NewsSandBox></NewsSandBox> :  // 有的话显示 新闻发布组件
                        <Redirect to='/login'/>       // 没有的话 重定向到login组件
                } />
            </Switch>
        </Router>
    )
}
