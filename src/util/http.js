import axios from 'axios'
import store from '../redux/store'

axios.defaults.baseURL = 'http://localhost:5000'


// 请求拦截器
axios.interceptors.request.use((config) => {
    // console.log(config);
    store.dispatch({
        type: "change_loading",
        flag: true
    })
    return config
}, (err) => {
    return Promise.reject(err)
})

// 响应拦截器
axios.interceptors.response.use((res) => {
    // console.log(res);
    store.dispatch({
        type: "change_loading",
        flag: false
    })
    return res
}, (err) => {
    store.dispatch({
        type: "change_loading",
        flag: false
    })
    return Promise.reject(err)
})