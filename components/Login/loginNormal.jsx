import React from 'react';
import {  Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from "@ant-design/icons";

export default function  LoginNormal ({handleLogin,onFinishFailed})  {

        return(
            <div>
               <Form
                                style={{ color: "white", }}
                                layout="vertical"
                                name="basic"
                                onFinish={handleLogin}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >

                                <Form.Item

                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'email',
                                            message: 'Nhập đúng email!!!',
                                        },
                                    ]}
                                >
                                    <Input  prefix={<UserOutlined />} />
                                </Form.Item>

                                <Form.Item
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mật khẩu không được để trống!',
                                        },
                                    ]}
                                >
                                    <Input.Password  prefix={<LockOutlined />} />
                                </Form.Item>

                                <Form.Item
                                    className="text-center"
                                >
                                    <Button type="primary"  htmlType="submit" style={{ width: "100%" }}>
                                        Đăng nhập
                                    </Button>

                                </Form.Item>

                            </Form>
            </div>
        )
   
}