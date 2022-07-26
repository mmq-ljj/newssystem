import React from 'react'
import {
    Table,
    Button,
    Modal,
    message,
} from 'antd';
import {
    DeleteOutlined,
} from '@ant-design/icons';


export default function NewsPublish(props) {

    // 传过来的数据  已发布、未发布、已下线
    const { dataSource, whatButtonFn } = props

    // console.log(props);

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, row) => <a href={`#/news-manage/preview/${row.id}`}>{title}</a>,
            align: "center",
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
            render: row => {
                return (
                    <div>{whatButtonFn(row.id)}</div >
                )
            }
        },
    ];

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                pagination={{
                    pageSize: 5
                }}
                rowKey={item => item.id}
            />
        </div>
    )
}
