// 该文件用于汇总所有的reducer为一个总的reducer

// 引入 combineReducers 用于汇总多个reducers
import { combineReducers } from 'redux'

// 引入控制折叠列表开关的reducer
import { collapsedReducer } from './collapsedReducer'

// 请求加载动画
import { loadingReducer } from './loadingReducer'

export default combineReducers({
    collapsedReducer,
    loadingReducer
})