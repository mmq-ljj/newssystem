import React, { useState, useEffect } from 'react'
// 组件
import { Table, Button, Modal, message, Tree } from 'antd'
// 图标
import {
    UnorderedListOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;

export default function RoleList() {
    // 角色列表
    const [roleList, setRoleList] = useState([])
    // 权限列表
    const [rightList, setRightList] = useState([])
    // 控制权限分配 显隐
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 权限树 数据
    const [currentRights, setCurrentRights] = useState([]);
    // 当前角色id
    const [roleId, setRoleId] = useState(0);
    // 表结构
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id => <b>{id}</b>,
            align: "center",
            // width: "300px",
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            align: "center",
            // width: "500px",
        },
        {
            title: '操作',
            align: "center",
            render: row => <div>
                {/* 权限分配 */}
                < Button
                    type="primary"
                    shape="circle"
                    icon={<UnorderedListOutlined />}
                    style={{ marginRight: '10px' }}
                    onClick={() => clickEdit(row)}
                />
                {/* 删除 */}
                < Button
                    danger
                    shape="circle"
                    icon={< DeleteOutlined />}
                    onClick={() => ifDelete(row)}
                />
            </div>
        }
    ];

    useEffect(() => {
        getRoleList()
        getRightList()
    }, [])

    // 获取角色列表
    const getRoleList = () => {
        axios.get('http://localhost:5000/roles').then(res => {
            // console.log(res.data);
            setRoleList(res.data)
        })
    }

    // 获取权限列表
    const getRightList = () => {
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            const handleList = res.data
            handleList.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ''
                }
            })
            setRightList(handleList);
        })
    }

    // 是否删除
    const ifDelete = (role) => {
        // console.log(row);
        confirm({
            title: '是否需要删除该角色?',
            icon: <ExclamationCircleOutlined />,
            okText: "确定",
            cancelText: "取消",
            // content: 'Some descriptions',
            onOk() { deleteRole(role) },
            onCancel() { },
        });
    }

    // 删除角色
    const deleteRole = (role) => {
        // console.log(role);
        axios.delete(`http://localhost:5000/roles/${role.id}`).then(res => {
            if (res.status === 200) {
                // 重新渲染数据
                message.success('删除成功！')
                getRoleList()
            }
        })
    }

    // 分配权限
    const clickEdit = (role) => {
        console.log(role);
        // console.log(role);
        setRoleId(role.id)
        let noFatherNodes = role.rights
        // noFatherNodes = noFatherNodes.filter(right => {
        //     // 默认不勾选父级 只勾选子级 
        //     if (right !== '/user-manage' &&
        //         right !== '/right-manage' &&
        //         right !== '/news-manage' &&
        //         right !== '/audit-manage' &&
        //         right !== '/publish-manage') {
        //         // console.log(right);
        //         return right
        //     } else {
        //         return ''
        //     }
        // })
        setCurrentRights(noFatherNodes)
        setIsModalVisible(true);
    }

    // 对话框 确定
    const handleOk = () => {

        // 前端自己处理权限数据
        // setRoleList(roleList.map(role => {
        //     if (role.id === roleId) {
        //         return {
        //             ...role,
        //             rights: currentRights
        //         }
        //     }
        //     return role
        // }))

        console.log(currentRights.checked);
        // 向后端发送分配后的权限
        // patch
        axios.patch(`http://localhost:5000/roles/${roleId}`, {
            rights: currentRights.checked
        }).then(res => {
            if (res.status === 200) {
                message.success('修改成功！')
                getRoleList()
            }
        })
        // console.log(currentRights);
        setIsModalVisible(false);
    };

    // 对话框 取消
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 勾选树节点发生变化时触发
    const onCheck = (checkedKeys) => {
        // console.log(checkedKeys);
        // setCurrentRights(checkedKeys.checked)
        setCurrentRights(checkedKeys)
    };


    return (
        <div>
            <Table
                dataSource={roleList}
                columns={columns}
                rowKey={(item) => item.id}
                bordered
            />
            <Modal
                title="权限分配"
                okText="确定"
                cancelText="取消"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    treeData={rightList}
                    checkStrictly={true}  // 父子节点选中状态不再关联
                    defaultExpandAll
                />
            </Modal>
        </div>
    )
}
