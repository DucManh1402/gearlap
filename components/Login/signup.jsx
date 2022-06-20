import React from 'react';
import { DatePicker, Form, Input, Button, Select, Steps,message } from 'antd';

const { Step } = Steps;


export default function  SignUp({handleRegister,onFinishFailed,addressVN,selectedAddress,handleSelectAddress,
    districtVN,selectDistrict,handleSelectDistrict,wardsVN,selectWards,handleSelectWards,current,next,prev,steps,tabSignUp,setTabSignUp})  {



    return(
        <div >
            {/* <Steps size="small" current={current} style={{marginBottom:"20px"}}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps> */}
      {/* <div className="steps-content">{setTabSignUp(steps[current].content)}</div> */}
     
             <Form
                                layout="vertical"
                                name="basic"
                                onFinish={handleRegister}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                {/* {tabSignUp==="tai-khoan" && <> */}
                                <Form.Item
                                   
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'email',
                                            message: 'Nhập đúng email!!!',
                                        },
                                    ]}
                                >
                                    <Input  placeholder="Email"/>
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mật khẩu không được để trống và độ dài trên 6 kí tự!',
                                            min: 6,
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="Mật khẩu"/>
                                </Form.Item>
                                {/* </>
                                }
                                {tabSignUp==="thong-tin" && <> */}
                                <Form.Item
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên đầy đủ không được để trống!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Họ và tên"/>
                                </Form.Item>
                                <Form.Item
                                    name="birthdate"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Ngày sinh không được để trống!',
                                        },
                                    ]}
                                >
                                    <DatePicker placeholder="Ngày sinh" style={{ width: "100%" }}/>
                                </Form.Item>
                                {/* </>
                                }
                                 {tabSignUp==="dia-chi" && <> */}
                                <Form.Item
                                    name="city"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'thành phố không được để trống!',
                                        },
                                    ]}
                                >
                                        <Select defaultValue="" value={selectedAddress?.codename || ""} onChange={handleSelectAddress}>
                                        <Option value="">-Chọn Thành Phố-</Option>
                                        {addressVN.map(address => {
                                            return <Option value={address.codename}>{address.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="district"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Quận/huyện không được để trống!',
                                        },
                                    ]}
                                >
                                    <Select value={selectDistrict?.codename || ""} disabled={selectedAddress?.codename && districtVN?.length !== 0 ? false : true}
                                        defaultValue=""  onChange={handleSelectDistrict}>
                                        <Option value="">-Chọn Quận-</Option>
                                        {districtVN === null && <Option value="">-Chọn Quận-</Option>}
                                        {districtVN && districtVN.map(district => {
                                            return <Option value={district.codename}>{district.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="wards"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Phường/xã không được để trống!',
                                        },
                                    ]}
                                >
                                      <Select value={selectWards?.codename || ""} disabled={selectedAddress?.codename && selectDistrict?.codename && wardsVN?.length !== 0 ? false : true}
                                        defaultValue=""  onChange={handleSelectWards}>
                                        <Option value="">-Chọn Phường-</Option>
                                        {wardsVN === null && <Option value="">-Chọn Phường-</Option>}
                                        {wardsVN && wardsVN.map(wards => {
                                            return <Option value={wards.codename}>{wards.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'số, đường không được để trống!',
                                        },
                                    ]}
                                >
                                   
                                    <Input disabled={selectedAddress?.codename && selectDistrict?.codename && selectWards?.codename ? false : true}  placeholder="Số nhà, đường" />
                                 
                                </Form.Item>
                                {/* </>
                                }
                                 {tabSignUp==="so-dien-thoai" && <> */}
                                <Form.Item
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Số điện thoại có độ dài là 10 số!',
                                            len: 10,
                                        },
                                    ]}
                                >
                                    <Input type="number" placeholder="Số điện thoại"/>
                                </Form.Item>

                                <Form.Item
                                    className="text-center"
                                >
                                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                        Đăng kí</Button>
                                </Form.Item>
                                {/* </>
                                } */}
                            </Form>
    {/* //                         <div className="steps-action">
    //     {current < steps.length - 1 && (
    //       <Button type="primary" onClick={() => next()}>
    //         Tiếp tục
    //       </Button>
    //     )}
    //     {current === steps.length - 1 && (
    //         <></>
    //     //   <Button type="primary" onClick={() => message.success('Processing complete!')}>
    //     //     Done
    //     //   </Button>
    //     )}
    //     {current > 0 && (
    //       <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
    //         Quay lại
    //       </Button>
    //     )}
    //   </div> */}
        </div>
    )

}