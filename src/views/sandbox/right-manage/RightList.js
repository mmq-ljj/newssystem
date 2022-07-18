import React, { useState, useEffect } from 'react'
import {
    Table,
    Tag,
    Button,
    Modal,
    message,
    Popover,
    Switch
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;

export default function RightList() {

    // 表格数据源
    const [dataSource, setDataSource] = useState([])

    // const [checked, seChecked] = useState(true)

    // 表结构
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id => <b>{id}</b>,
            key: 'id',
            align: "center",
            width: "140px",
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            key: 'title',
            align: "center",
            width: "200px",
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'key',
            align: "center",
            render: key => <Tag color="green">{key}</Tag>
        },
        {
            title: '操作',
            align: "center",
            width: "220px",
            render: row => {
                return (
                    <div>
                        {/* 编辑 */}
                        <Popover
                            content={
                                <div style={{ textAlign: "center" }}>
                                    <Switch
                                        checked={row.pagepermisson}
                                        onChange={() => switchChange(row)}
                                    >
                                    </Switch>
                                </div>
                            }
                            title="页面配置项"
                            trigger={row.pagepermisson === undefined ? '' : 'click'}
                        >
                            < Button
                                type="primary"
                                shape="circle"
                                icon={< EditOutlined />}
                                style={{ marginRight: '10px' }}
                                disabled={row.pagepermisson === undefined}
                            />
                        </Popover>
                        {/* 删除 */}
                        < Button
                            danger
                            shape="circle"
                            icon={< DeleteOutlined />}
                            onClick={() => ifDelete(row)}
                        />
                    </div >
                )
            }
        },
    ];

    useEffect(() => {
        getRightList()
    }, []) //eslint-disable-line

    // 获取权限列表
    const getRightList = () => {
        axios.get("/rights?_embed=children").then(res => {
            const handleList = res.data
            handleList.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ''
                }
            })
            setDataSource(handleList);
        })
    }

    // 编辑权限
    const switchChange = (row) => {
        // console.log(row.pagepermisson);
        if (row.pagepermisson === 1) {
            row.pagepermisson = 0
        } else if (row.pagepermisson === 0) {
            row.pagepermisson = 1
        }
        // console.log(row.pagepermisson);
        setDataSource([...dataSource])

        if (row.grade === 1) {
            axios.patch(`/rights/${row.id}`, {
                pagepermisson: row.pagepermisson
            }).then(res => {
                if (res.status === 200) {
                    // 重新渲染数据
                    message.success('修改成功！')
                    getRightList()
                }
            })
        } else if (row.grade === 2) {
            // console.log(row.grade);
            axios.patch(`/children/${row.id}`, {
                pagepermisson: row.pagepermisson
            }).then(res => {
                if (res.status === 200) {
                    message.success('修改成功！')
                    // 重新渲染数据
                    getRightList()
                }
            })
        }
    }

    // 删除前的回调
    const ifDelete = (row) => {
        // console.log(row);
        confirm({
            title: '是否删除该权限',
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

    // 删除权限
    const deleteRight = (row) => {
        // console.log(row.grade);
        // 一级路由权限
        if (row.grade === 1) {
            axios.delete(`/rights/${row.id}`).then(res => {
                if (res.status === 200) {
                    // 重新渲染数据
                    message.success('删除成功！')
                    getRightList()
                }
            }
            )
            // 二级路由权限
        } else if (row.grade === 2) {
            // console.log(row.grade);
            axios.delete(`/children/${row.id}`).then(res => {
                if (res.status === 200) {
                    message.success('删除成功！')
                    // 重新渲染数据
                    getRightList()
                }
            }
            )
        }
    }

    // html
    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            pagination={{
                pageSize: 5
            }}
        />
    )
}
