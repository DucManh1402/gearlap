import React from 'react';
import { DatePicker, Form, Input, Button, Select, Steps, message } from 'antd';

const { Step } = Steps;
import Router from 'next/router';

export default function Information() {
    return (
        <>
            <div className='flex justify-between my-5'>
                <div className='text-xl font-semibold' > Thông tin liên lạc</div>
            </div>
            <Form

                layout="vertical"
                name="basic"

                // onFinish={handleRegister}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                {/* {tabSignUp==="tai-khoan" && <> */}
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
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Tên đầy đủ không được để trống!',
                        },
                    ]}
                >
                    <Input placeholder="Họ và tên" />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Số điện thoại có độ dài là 10 số!',
                            len: 10,
                        },
                    ]}
                >
                    <Input type="number" placeholder="Số điện thoại" />
                </Form.Item>

                <Form.Item
                    className="text-center"
                >
                    <Button type="primary" onClick={() => Router.push('/success')} htmlType="submit" style={{ width: "100%" }}>
                        Tiếp tục</Button>
                </Form.Item>
            </Form>

        </>
    )

}