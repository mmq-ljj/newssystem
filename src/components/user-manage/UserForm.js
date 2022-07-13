import React, { forwardRef, useState } from 'react'
import {
    Form,
    Input,
    Select,
} from 'antd';
import { useEffect } from 'react';

const { Option } = Select
const UserForm = forwardRef((props, ref) => {
    // 是否禁用区域
    const [isDisabled, setIsDisabled] = useState(false)
    // console.log(ref);
    const { regionList, roleList, isUpdateDisabled } = props


    useEffect(() => {
        // console.log(isUpdateDisabled);
        setIsDisabled(isUpdateDisabled)
    }, [isUpdateDisabled])

    return (
        <Form
            ref={ref}
            layout='vertical'
        >
            {/* 用户名 */}
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            {/* 密码 */}
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input type='password' />
            </Form.Item>
            {/* 区域 */}
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select disabled={isDisabled}>
                    {
                        regionList.map(region =>
                            <Option
                                value={region.value}
                                key={region.id}>
                                {region.title}
                            </Option>
                        )
                    }
                </Select>
            </Form.Item>
            {/* 角色 */}
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select
                    onChange={(value) => {
                        // console.log(value);
                        // console.log(ref);
                        // 如果选择超级管理员，禁用区域 (默认全球)，并情况区域数据
                        if (value === 1) {
                            setIsDisabled(true)
                            ref.current.setFieldsValue({
                                region: ""
                            })
                        } else {
                            setIsDisabled(false)
                        }
                    }}>
                    {
                        roleList.map(role =>
                            <Option
                                value={role.id}
                                key={role.id}>
                                {role.roleName}
                            </Option>
                        )
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default UserForm
