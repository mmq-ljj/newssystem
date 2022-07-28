// 引入createStore，专门用于创建redux中最为核心的store对象
import { legacy_createStore as createStore } from 'redux'
// 
import reducer from './reducers/index'

const store = createStore(reducer)

export default store