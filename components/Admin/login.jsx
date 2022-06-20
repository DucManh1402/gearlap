import React, { useState,useEffect  } from 'react'
import { Layout,Form, Input, Button ,message } from 'antd';
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from 'next/link'
import { useRecoilState } from 'recoil';
import Router from 'next/router'

import apiService from '../../utils/api/apiService';
import { userState } from '../../store/userState';
import axios from 'axios';

const { Header, Footer, Sider, Content } = Layout;

export default function AdminLogin() {
    const [user, setUser] = useRecoilState(userState);

    const handleLogin = async (values) => {
        const key = "login";

        try {
            message.loading({ content: "Đang đăng nhập", key })
            await apiService.post('/admins/login', values);
            const response = await apiService.get('/users/me');
            setUser(response.data);
        
            message.success({ content: "Đăng nhập thành công", key })
        } catch (error) {
            message.error({ content: error.response.data.message, key })
        }

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(() => {
        if (user.user_id && user.role === "admin") {
            Router.push('/admin')
        }
    }, [user])
    return(
<Layout className="rounded-xl  md:p-0 ">
     
      <div className="sticky z-50 top-0">
        <Header style={{ background: "black" }} className="flex justify-between items-center shadow-xl opacity-90">
        <div className="text-xl ">
        <Link href="/">
                <a className="text-yellow-200 hover:text-white" >GearLap</a>
              </Link>
        </div>
        <div className='text-sm text-white'>Powered by M-T</div>
        </Header>
      </div>
      <Layout >
     
        <Content  className="site-layout">
        
          <div className="bg-gray-100 ">
            <div className=" mx-auto">
            <div className='h-full flex justify-center bg-cover bg-center relative '
             style={{
                backgroundImage: `url(https://wallpaperaccess.com/full/3277278.jpg)`,
                }}
                >
                <div className="max-w-3xl  my-12 py-8 px-16 bg-white rounded-xl hover:shadow-xl z-0 ">
                    <div className="text-center  text-xl font-normal" style={{ fontFamily: "muli,sans-serif" }}>
                  
                            <p className='font-semibold text-xl'>M-T - Đăng nhập</p>
                            <p className='text-sm'>Xin chào, vui lòng nhập thông tin đăng nhập</p>
                            <p className='font-medium'>GearLap</p>
                  
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

                </div>     
            </div>
            </div>
            </div>
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>©Trang quản trị của project GearLap</Footer>

    </Layout>
  
    )
}