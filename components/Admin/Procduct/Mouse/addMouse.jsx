import React, { useState,useEffect } from 'react'
import {  Upload, Modal, Button,Spin,Input,Form,Select,Checkbox } from "antd";
import { UploadOutlined} from '@ant-design/icons';
const { Option } = Select;

export default function AddMouse({onFinishFailed,isModalAdd,handleCancelAdd}) {
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
                                        ></Form.Item>
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
                                            label="Nút"
                                            name="button"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Loại sản phẩm không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Select >
                                            <Option value="Phang">Phẳng</Option>
                                            <Option value="Cong">Cong</Option>
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                            label="Màu"
                                            name="color"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Lưu trữ không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Select >
                                            <Option value="IPS">IPS</Option>
                                            <Option value="VA">VA</Option>
                                            <Option value="TN">TN</Option>
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                        label="Switch"
                                            name="switch"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'CPU không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Select >
                                            <Option value="qHD">qHD</Option>
                                            <Option value="HD">HD</Option>
                                            <Option value="FullHD">FullHD</Option>
                                            <Option value="2K">2K</Option>
                                            <Option value="4K">4K</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                        label="Led"
                                            name="led"
                                          
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                        label="Chiều dài dây"
                                            name="length"
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
                                        label="Software"
                                            name="software"
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
                                        label="Dpi"
                                            name="dpi"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Âm thanh không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Select />

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
                                            <Select />

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