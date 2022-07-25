import React, { useEffect, useState, useRef, useContext, createContext } from 'react'
import {
    Table,
    Button,
    Modal,
    message,
    Form,
    Input
} from 'antd';
import {
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { confirm } = Modal;

// 新闻分类
export default function NewsCategory() {

    // 门类列表
    const [categoryList, setCategoryList] = useState()

    // 创建一个context容器对象
    const EditableContext = createContext(null);

    useEffect(() => {
        getCategoryList()
    }, [])

    // 获取分类列表
    const getCategoryList = async () => {
        const { data: res } = await axios.get('/categories')
        // console.log(res);
        setCategoryList(res)
    }

    // 编辑某一行保存方法
    const handleSave = (record) => {
        console.log(record);
        axios.patch(`/categories/${record.id}`, {
            title: record.title,
            value: record.title
        }).then(res => {
            // console.log(res);
            if (res.status === 200) {
                message.success('修改成功！')
                getCategoryList()
            }
        })
    }

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
            title: '栏目名称',
            dataIndex: 'title',
            key: 'title',
            align: "center",
            width: "200px",
            onCell: (record) => ({
                record,
                editable: true,  // 开启 行编辑
                dataIndex: "title",
                title: '栏目名称',
                handleSave,    // 行失去焦点 保存方法
            }),
        },

        {
            title: '操作',
            align: "center",
            width: "220px",
            render: row => {
                return (
                    <div>
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

    // 是否删除
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

    // 确认删除
    const deleteRight = (row) => {
        axios.delete(`/categories/${row.id}`).then(res => {
            if (res.status === 200) {
                message.success('删除成功！')
                getCategoryList()
            }
        })
    }

    // 编辑表格行时
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                {/* 通过 Provider 把数据传给子组件 */}
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    // 
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);

        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };

    return (
        <Table
            dataSource={categoryList}
            columns={columns}
            bordered
            pagination={{
                pageSize: 7
            }}
            rowKey={item => item.id}
            components={{
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                },
            }}
        />
    )
}
