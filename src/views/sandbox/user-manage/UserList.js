import React, { useEffect, useState, useRef } from 'react'
import {
  Switch,
  Table,
  Button,
  Modal,
  message
} from 'antd';
import axios from 'axios';

import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm'
const { confirm } = Modal;


export default function UserList() {

  // 用户列表
  const [userList, setUserList] = useState([])

  // 是否展示添加用户 弹出框
  const [isAndVisible, setIsAndVisible] = useState(false)

  // 是否展示编辑用户 弹出框
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)


  // 角色列表
  const [roleList, setRoleList] = useState([])

  // 区域列表
  const [regionList, setRegionList] = useState([])

  // 新增表单ref
  const addFormRef = useRef(null)

  // 编辑表单ref
  const updateFormRef = useRef(null)

  // 是否禁用区域
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)

  // 修改用户id 
  const [updateId, setUpdateId] = useState(null)


  useEffect(() => {
    getUserList()   // 获取用户
    getRegionList() // 获取区域下拉菜单
    getRoleList()   // 获取角色下拉菜单
  }, [])

  // 获取用户列表
  const getUserList = () => {
    // axios.get('http://localhost:5000/users?_expand=role')
    //   .then(res => {
    //     setUserList(res.data)
    //   })

    axios.get('http://localhost:5000/users')
      .then(res => {
        setUserList(res.data)
      })

  }

  // 获取区域下拉菜单
  const getRegionList = () => {
    axios.get('http://localhost:5000/regions').then(res => {
      setRegionList(res.data)
    })
  }

  // 获取角色下拉菜单
  const getRoleList = () => {
    axios.get('http://localhost:5000/roles').then(res => {
      setRoleList(res.data)
    })
  }

  // 表结构
  const columns = [
    // 区域
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      align: "center",
      render: region => <b>{region === '' ? '全球' : region}</b>,
      filters: [
        ...regionList.map(item => {
          return {
            text: item.title,
            value: item.value
          }
        }),
        {
          text: "全球",
          value: "全球"
        }
      ],
      onFilter: (value, record) => {
        return value === '全球' ? record.region === '' : record.region === value;
      },
    },
    // 角色名称
    {
      title: '角色名称',
      // users?_expand=role 接口
      // dataIndex: 'role',
      // key: 'role',
      // render: role => { return role?.roleName },
      // users 接口
      dataIndex: 'roleId',
      key: 'roleId',
      render: roleId => {
        if (roleId === 1) {
          return '超级管理员'
        } else if (roleId === 2) {
          return '区域管理员'
        } else if (roleId === 3) {
          return '区域编辑'
        }
      },
      align: "center",
    },
    // 用户名
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      align: "center",
    },
    // 用户状态
    {
      title: '用户状态',
      dataIndex: 'roleState',
      key: 'roleState',
      align: "center",
      render: (roleState, row) => {
        return <Switch
          checked={roleState}
          disabled={row.default}
          onChange={() => { switchChange(row) }}
        >
        </Switch>
      }
    },
    // 操作
    {
      title: '操作',
      align: "center",
      render: row => {
        return (
          <div>
            {/* 编辑 */}
            < Button
              type="primary"
              shape="circle"
              icon={< EditOutlined />}
              style={{ marginRight: '10px' }}
              disabled={row.default}
              onClick={() => clickEdit(row)}
            />
            {/* 删除 */}
            < Button
              danger
              shape="circle"
              disabled={row.default}
              icon={< DeleteOutlined />}
              onClick={() => ifDelete(row)}
            />
          </div >
        )
      }
    },
  ];

  // 用户状态改变时
  const switchChange = (row) => {
    // console.log(row)
    // 因为是浅拷贝 这里修改 会影响到 源数据
    row.roleState = !row.roleState
    // console.log(userList);
    setUserList([...userList])
    axios.patch(`http://localhost:5000/users/${row.id}`, {
      roleState: row.roleState
    }).then(res => {
      if (res.status === 200) {
        message.success('修改成功！')
      }
    })

  }

  // 是否删除用户
  const ifDelete = (user) => {
    confirm({
      title: '是否需要删除该用户?',
      icon: <ExclamationCircleOutlined />,
      okText: "确定",
      cancelText: "取消",
      // content: 'Some descriptions',
      onOk() { deleteUser(user) },
      onCancel() { },
    });
  }

  // 确定删除用户
  const deleteUser = (user) => {
    axios.delete(`http://localhost:5000/users/${user.id}`).then(res => {
      if (res.status === 200) {
        // 重新渲染数据
        message.success('删除成功！')
        getUserList()
      }
    })
  }

  // 编辑用户 async
  const clickEdit = async (user) => {
    setUpdateId(user.id)
    // console.log(user);
    // setIsUpdateVisible(true)
    // setTimeout(() => {
    //   updateFormRef.current.setFieldsValue({
    //     ...user
    //   })
    // }, 0)
    // 打开跟新用户对话框
    await setIsUpdateVisible(true)
    // 该用户为超级管理员
    if (user.roleId === 1) {
      setIsUpdateDisabled(true)
    } else {
      setIsUpdateDisabled(false)
    }
    updateFormRef.current.setFieldsValue({
      ...user
    })
  }

  // 确定编辑
  const updateFormOk = () => {

    setIsUpdateVisible(false)
    setIsUpdateDisabled(!isUpdateDisabled)

    updateFormRef.current.validateFields()
      .then(formData => {
        // console.log(formData);
        axios.patch(`http://localhost:5000/users/${updateId}`, {
          ...formData,
        }).then(res => {
          console.log(res);
          // 添加成功
          if (res.status === 200) {
            // 重新渲染用户列表
            getUserList()
          }
        })
      })
  }


  // 添加用户
  const addUser = () => {
    setIsAndVisible(true)
  }

  // 确定添加用户
  const addFormOk = () => {
    setIsAndVisible(false)
    // 触发表单验证 拿到表单数据
    addFormRef.current.validateFields()
      .then(formData => {
        // 重置表单
        addFormRef.current.resetFields()
        console.log(formData);
        // 传给后端
        axios.post('http://localhost:5000/users', {
          ...formData,
          "roleState": false,  // 用户状态
          "default": false,    // 是否为超级管理员
        }).then(res => {
          // 添加成功
          if (res.statusText === "Created") {
            getUserList()
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: "10px" }}
        onClick={addUser}
      >
        添加用户
      </Button>

      {/* 用户列表 */}
      <Table
        bordered
        columns={columns}
        dataSource={userList}
        pagination={{
          pageSize: 6
        }}
      />

      {/* 添加用户 对话框 */}
      <Modal
        visible={isAndVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAndVisible(false)
        }}
        onOk={() => addFormOk()}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={addFormRef}>
        </UserForm>
      </Modal>

      {/* 编辑用户 对话框 */}
      <Modal
        visible={isUpdateVisible}
        title="修改用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => updateFormOk()}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          isUpdateDisabled={isUpdateDisabled}
          ref={updateFormRef}>
        </UserForm>
      </Modal>
    </div>
  )
}
