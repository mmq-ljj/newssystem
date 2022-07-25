import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  message

} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { confirm } = Modal;

// 审核新闻
export default function Audit() {
  // 新闻列表
  const [newsList, setNewsList] = useState([])

  useEffect(() => {
    getAuditNewsList()
  }, [])

  // 通过新闻
  const passNews = async (row) => {
    confirm({
      title: '是否要通过该条新闻?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: "确定",
      cancelText: '取消',
      onOk() {
        axios.patch(`/news/${row.id}`, {
          auditState: 2,   // 审核通过
          publishState: 1  // 未发布
        }).then(res => {
          console.log(res); 
          if (res.status) {
            message.success('通过成功！')
            getAuditNewsList()
          }
        })

      },
      onCancel() { },
    });
  }


  // 驳回新闻
  const rejectNews = (row) => {
    confirm({
      title: '是否要驳回该条新闻?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: "确定",
      cancelText: '取消',
      onOk() {
        axios.patch(`/news/${row.id}`, {
          auditState: 3,   // 审核不通过
          publishState: 0  // 待发布
        }).then(res => {
          if (res.status) {
            message.success('驳回成功！')
            getAuditNewsList()
          }
        })

      },
      onCancel() { },
    });
  }

  // 表结构
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
      title: '操作',
      align: "center",
      render: row =>
        <div>
          {/* 通过 */}
          <Button
            type='primary'
            style={{ marginRight: "10px" }}
            icon={<CheckOutlined />}
            shape="circle"
            onClick={() => { passNews(row) }}
          ></Button>

          {/* 驳回 */}
          <Button danger
            icon={<CloseOutlined />}
            shape="circle"
            onClick={() => { rejectNews(row) }}
          >
          </Button>
        </div>
    }
  ];


  // 从localStorage取出登录时存入的用户信息
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  // console.log(roleId, region, username);
  // 获取需要审核的新闻列表
  const getAuditNewsList = async () => {
    const { data: newsList } = await axios.get(`/news?auditState=1&_expand=category`)
    // console.log(newsList);

    // roleId 超级管理员
    setNewsList(roleId === 1 ?
      newsList :
      // 作者是当前登录用户
      [...newsList.filter(item => item.author === username),
      // 相同区域 并且是区域编辑(权限比区域管理员小)
      ...newsList.filter(item => item.region === region && item.roleId === 3)
      ]
    )

  }
  return (
    <div>

      {/* 用户列表 */}
      <Table
        bordered
        columns={columns}
        dataSource={newsList}
        pagination={{
          pageSize: 6
        }}
        rowKey={item => item.id}
      />
    </div>
  )
}
