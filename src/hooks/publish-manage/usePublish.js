import axios from 'axios'
import { useEffect, useState } from 'react'
import {
    Modal,
    message,
} from 'antd';
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';
const { confirm } = Modal


// 自定义hook
function usePublish(publishState) {
    // console.log(publishState);
    const [dataSource, setDataSource] = useState([])

    const { username } = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        // 获取发布的信息
        // publishState
        // 1 未发布 2 已发布 3 已下线
        getPublishList()
    }, [username, publishState])

    // 根据用户名 和 新闻发布状态获取数据
    const getPublishList = () => {
        axios.get(`/news?author=${username}&publishState=${publishState}&_expand=category`)
            .then(res => {
                setDataSource(res.data)
            })
    }

    // 发布新闻
    const handlePublish = (id) => {
        // console.log('发布', id);
        confirm({
            title: '是否发布该条新闻?',
            icon: <ExclamationCircleOutlined />,
            okText: "确定",
            cancelText: '取消',
            onOk() {
                axios.patch(`/news/${id}`, {
                    publishState: 2,
                    publishTime: Date.now(),
                }).then(res => {
                    // console.log(res);
                    if (res.status === 200) {
                        message.success('发布成功！')
                        getPublishList()
                    }
                })
            },
            onCancel() { },
        });
    }

    // 下线新闻
    const handleSunset = (id) => {
        // console.log('下线', id);
        confirm({
            title: '是否下线该条新闻?',
            icon: <ExclamationCircleOutlined />,
            okText: "确定",
            cancelText: '取消',
            onOk() {
                axios.patch(`/news/${id}`, {
                    publishState: 3,
                }).then(res => {
                    // console.log(res);
                    if (res.status === 200) {
                        message.success('下线成功！')
                        getPublishList()
                    }
                })
            },
            onCancel() { },
        });
    }

    // 删除新闻
    const handleDelete = (id) => {
        // console.log('删除', id);
        confirm({
            title: '是否下线该条新闻?',
            icon: <ExclamationCircleOutlined />,
            okText: "确定",
            cancelText: '取消',
            onOk() {
                axios.delete(`/news/${id}`).then(res => {
                    // console.log(res);
                    if (res.status === 200) {
                        message.success('删除成功！')
                        getPublishList()
                    }
                })
            },
            onCancel() { },
        });
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}



export default usePublish