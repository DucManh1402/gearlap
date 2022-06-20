import React, { useState,useEffect } from 'react'
import {  Upload, Modal, Button,Spin,Input,Form,Select,Checkbox } from "antd";
import { UploadOutlined} from '@ant-design/icons';
const { Option } = Select;

export default function AddLaptop({onFinishFailed,isModalAdd,handleCancelAdd}) {
    return(
        <Modal title="Thêm sản phẩm" visible={isModalAdd}  onCancel={handleCancelAdd}    footer={null}
      
        >
                <div className="flex flex-col space-y-4">
        
                 <Upload
              
                 maxCount="1"
                name="file"
                accept='.png,.jpeg,.gif,.mp4,.jpg'
                // beforeUpload={beforeUpload}
                //  onChange={handleChangeImage}
                //  onRemove={deleteImage}
                // customRequest={customUpload}
                listType="picture"
                iconRender={() =>{
                  return <Spin></Spin>
                }}
                progress={{
                  strokeColor:{
                    "0%": "#f0f",
                    "100%": "#ff0",
                  }
                }}
              //   defaultFileList={[...fileList]}
                className="upload-list-inline"
              >
                <Button icon={<UploadOutlined />}>Tải ảnh</Button>
              </Upload>
              
                
                 <Form
                                        layout="vertical"
                                        name="basic"
                                        //  onFinish={handleaddProduct}
                                        onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                    >  
                                       <Form.Item
                                            label="Hãng"
                                            name="name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Tên sản phẩm không được để trống!',
                                                },
                                            ]}
                                        >
                                        <Select ></Select>
                                        </Form.Item>
                                        <Form.Item
                                            label="Tên sản phẩm"
                                            name="name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Tên sản phẩm không được để trống!',
                                                },
                                            ]}
                                        >
                                        <Select ></Select>
                                        </Form.Item>
                                        <Form.Item
                                        label="Model"
                                            name="model"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Model không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Loại "
                                            name="type"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Loại sản phẩm không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Select >
                                            <Option value="Gaming">Gaming</Option>
                                            <Option value="Van phong">Văn phòng</Option>
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                            label="Lưu trữ"
                                            name="disk"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Lưu trữ không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Select ></Select>

                                        </Form.Item>
                                        <Form.Item
                                        label="CPU"
                                            name="cpu"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'CPU không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                        label="RAM"
                                            name="ram"
                                          
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                        label="VGA"
                                            name="vga"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'VGA không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Input />

                                        </Form.Item>
                                        <Form.Item
                                        label="Màn hình"
                                            name="monitor"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Màn hình không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Input />

                                        </Form.Item>
                                        <Form.Item
                                        label="Cổng truyền"
                                            name="communication"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Màn hình không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Input />

                                        </Form.Item>
                                        <Form.Item
                                        label="Âm thanh"
                                            name="audio"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Âm thanh không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Input />

                                        </Form.Item>
                                        <Form.Item
                                        label="Đọc bộ nhớ"
                                            name="read_memory"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Màn hình không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Input />

                                        </Form.Item>
                                        <Form.Item
                                        label="Lan"
                                            name="lan"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Màn hình không được để trống!',
                                                },
                                            ]}
                                        >
                                         <Select >
                                            <Option value="Gaming">Gaming</Option>
                                            <Option value="Van phong">Văn phòng</Option>
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                        label="Wifi"
                                            name="wifi"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Màn hình không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Select >
                                            <Option value="Gaming">Gaming</Option>
                                            <Option value="Van phong">Văn phòng</Option>
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                        label="Blutooth"
                                            name="blutooth"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Màn hình không được để trống!',
                                                },
                                            ]}
                                        >
                                           <Select >
                                            <Option value="Gaming">Gaming</Option>
                                            <Option value="Van phong">Văn phòng</Option>
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                        label="Webcam"
                                            name="webcam"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Màn hình không được để trống!',
                                                },
                                            ]}
                                        >
                                           <Select >
                                            <Option value="Gaming">Gaming</Option>
                                            <Option value="Van phong">Văn phòng</Option>
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                        label="Hệ điều hành"
                                            name="operator"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Màn hình không được để trống!',
                                                },
                                            ]}
                                        >
                                           <Select >
                                            <Option value="Gaming">Gaming</Option>
                                            <Option value="Van phong">Văn phòng</Option>
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                        label="Pin"
                                            name="pin"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Màn hình không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Select >
                                            <Option value="3">3 Cell</Option>
                                            <Option value="4">4 Cell</Option>
                                            <Option value="6">6 Cell</Option>
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                        label="Cân nặng"
                                            name="weight"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Màn hình không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Input />

                                        </Form.Item>
                                        <Form.Item
                                        label="Size"
                                            name="size"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Màn hình không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Input />

                                        </Form.Item>
                                        <Form.Item
                                            className="text-center"
                                        >
                                            <Button htmlType="submit" style={{ width: "100%" }} >Thêm sản phẩm mới</Button>
                                        </Form.Item>
               
               </Form>
               </div>
                 </Modal>
    )
}