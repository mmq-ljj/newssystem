import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    Table,
    Button,
    Tag,
    message,
    Modal
} from 'antd'
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';
const { confirm } = Modal;


export default function AuditList(props) {
    // 审核列表
    const [auditList, setAuditList] = useState([])

    const { username } = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        // 审核列表里查看的是该用户的
        // 审核状态不为0
        // 发布状态小于1的新闻
        getAuditList()
    }, [])

    const getAuditList = () => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            // console.log(res.data);
            setAuditList(res.data)
        })
    }

    const auditStatusList = ['', '审核中', '已通过', '未通过']

    // const publishStatusList = ['未发布', '待发布', '已上线', '已下线']

    const colorList = ['', 'orange', 'green', 'red']

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            align: "center",
            render: (title, row) => {
                return <a href={`#/news-manage/preview/${row.id}`}>{title}</a>
            },
        },
        {
            title: '作者',
            dataIndex: 'author',
            align: "center",
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: category => <div>
                {category.title}
            </div>,
            align: "center",
        },
        {
            title: '审核状态',
            dataIndex: 'auditState', // 1 审核中 2 通过 3 未通过
            render: auditState => <div>
                <Tag color={colorList[auditState]}>{auditStatusList[auditState]}</Tag>
            </div>,
            align: "center",
            key: "auditState",
        },
        {
            title: '操作',
            align: "center",
            render: row => <div>
                {
                    row.auditState === 1 &&
                    <Button danger onClick={() => handleCancel(row)}>
                        撤销
                    </Button>
                }
                {
                    row.auditState === 2 &&
                    <Button
                        style={{ backgroundColor: "#85ce61", border: "1px solid #85ce61" }}
                        type='primary'
                        onClick={() => handlePublish(row)}
                    >
                        发布
                    </Button>
                }
                {
                    row.auditState === 3 && <Button type='primary' onClick={() => {
                        handleUpdate(row)
                    }}>
                        修改
                    </Button>
                }

            </div>
        }

    ];

    // 撤销
    const handleCancel = (row) => {
        confirm({
            title: '是否要撤销该条新闻?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            okText: "确定",
            cancelText: '取消',
            onOk() {
                // console.log('OK');
                axios.patch(`/news/${row.id}`, {
                    auditState: 0
                }).then(res => {
                    if (res.status === 200) {
                        message.success('撤销成功，可在草稿箱中查看！')
                        getAuditList()
                    }
                })
            },
            onCancel() { },
        });
    }

    // 修改
    const handleUpdate = (row) => {
        props.history.push(`/news-manage/update/${row.id}`)
    }

    // 发布
    const handlePublish = (row) => {
        confirm({
            title: '是否发布该条新闻?',
            icon: <ExclamationCircleOutlined />,
            okText: "确定",
            cancelText: '取消',
            onOk() {
                axios.patch(`/news/${row.id}`, {
                    publishState: 2,
                    publishTime: Date.now(),
                }).then(res => {
                    // console.log(res);
                    if (res.status === 200) {
                        message.success('发布成功！')
                        getAuditList()
                    }
                })
            },
            onCancel() { },
        });
    }


    return (
        <div>
            <Table
                bordered
                columns={columns}
                dataSource={auditList}
                pagination={{
                    pageSize: 6
                }}
                rowKey={item => item.id}
            />
        </div>
    )
}
