import React, { useEffect, useState } from 'react'
import {
    Table,
    Button,
    Modal,
    message,
} from 'antd'
import {
    EditOutlined,
    DeleteOutlined,
    VerticalAlignTopOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios'
// import { Link } from 'react-router-dom'
const { confirm } = Modal;

// 新闻管理 - 草稿箱
export default function NewsDraft(props) {

    const [draftList, setDraftList] = useState([])

    const { username } = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        getNewsDraft()
    }, [])

    // &_expand=category
    const getNewsDraft = async () => {
        const { data: res } = await axios.get(`/news?author=${username}&auditState=0&_expand=category`)
        // console.log(res);
        setDraftList(res)
    }

    // 删除前的回调
    const ifDelete = (row) => {
        // console.log(row);
        confirm({
            title: '是否删除该新闻？',
            icon: <ExclamationCircleOutlined />,
            okText: "确定",
            cancelText: "取消",
            // content: 'Some descriptions', // 内容
            // 确认
            onOk() {
                deleteRight(row)
            },
            // 取消
            onCancel() { },
        });
    }

    // 确定删除草稿箱里的新闻
    const deleteRight = (row) => {
        axios.delete(`/news/${row.id}`).then(res => {
            if (res.status === 200) {
                message.success('删除成功！')
                getNewsDraft()
            }
        })
    }

    // 提交审核
    const handleCheck = (id) => {
        confirm({
            title: '是否确定将该新闻提交审核？',
            icon: <ExclamationCircleOutlined />,
            okText: "确定",
            cancelText: "取消",
            onOk() {
                axios.patch(`/news/${id}`, {
                    auditState: 1,
                }).then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        message.success('提交审核成功！')
                        props.history.push('/audit-manage/list')
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id => <b>{id}</b>,
            align: "center",
            // width: "300px",
            key: "id"
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            align: "center",
            key: 'title',
            render: (title, row) => {
                return <a href={`#/news-manage/preview/${row.id}`}>{title}</a>
                // return <Link to={`#/news-manage/preview/${row.id}`}>{title}</Link>
            },
        },
        {
            title: '作者',
            dataIndex: 'author',
            align: "center",
            key: "author",

        },
        {
            title: '分类',
            dataIndex: 'category',
            render: category => <div>
                {category.title}
            </div>,
            align: "center",
            key: "category",
        },
        {
            title: '操作',
            align: "center",
            render: row => <div>
                {/* 跟新(编辑) */}
                < Button
                    type="primary"
                    shape="circle"
                    icon={<EditOutlined />}
                    style={{ marginRight: '10px' }}
                    onClick={() => {
                        props.history.push(`/news-manage/update/${row.id}`)
                    }}
                />
                {/* 删除 */}
                < Button
                    danger
                    shape="circle"
                    icon={< DeleteOutlined />}
                    style={{ marginRight: '10px' }}
                    onClick={() => ifDelete(row)}
                />

                {/* 发布 */}
                < Button
                    shape="circle"
                    icon={<VerticalAlignTopOutlined />}
                    onClick={() => handleCheck(row.id)}
                />
            </div>
        }
    ];

    return (
        <div>
            <Table
                bordered
                columns={columns}
                dataSource={draftList}
                pagination={{
                    pageSize: 6
                }}
                rowKey={item => item.id}
            />
        </div>
    )
}
