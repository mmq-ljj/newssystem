// 是否展示请求时加载转圈动画
const initState = { isLoading: false }
export const loadingReducer = (prevState = initState, action) => {
    // console.log(action);
    const { type, flag } = action
    switch (type) {
        case 'change_loading':
            let newState = { ...prevState }
            newState.isLoading = flag
            return newState
        default:
            return prevState
    }
}