
import React from 'react'
import './App.css'
// import axios from 'axios'
import IndexRouter from './router/IndexRouter'
import { Provider } from 'react-redux'
import store from './redux/store'

// app根组件
function App() {

  // return (
  //   <div id=''>
  //     <IndexRouter></IndexRouter>
  //   </div>
  // )

  // 注册路由 根据路劲 展示对应的 路由组件 (一级路由) 
  return <Provider store={store}>
    <IndexRouter></IndexRouter>
  </Provider>
}


export default App
