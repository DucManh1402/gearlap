import React, { useState,useEffect } from 'react'
import {  Upload, Modal, Button,Spin,Input,Form,Select} from "antd";
import { UploadOutlined} from '@ant-design/icons';

export default function AddProduct({brands,categories,deleteImage,handleChangeImage,onFinishFailed,isModalAddProduct,handleCancelAddProduct,handleaddProduct}) {
    return(
        <Modal title="Thêm sản phẩm" visible={isModalAddProduct}  onCancel={handleCancelAddProduct}    footer={null}
      
        >
                <div className="flex flex-col space-y-4">
        
                 <Upload
              
                 maxCount="1"
                name="file"
                accept='.png,.jpeg,.gif,.mp4,.jpg'
                // beforeUpload={beforeUpload}
                 onChange={handleChangeImage}
                 onRemove={deleteImage}
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
                                         onFinish={handleaddProduct}
                                        onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                    >  
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
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Loại sản phẩm"
                                            name="type_id"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Loại sản phẩm không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Select >
            {categories.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>

                                        </Form.Item>
                                        <Form.Item
                                            label="Hãng"
                                            name="brand_id"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Hãng không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Select >
            {brands.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>

                                        </Form.Item>
                                        <Form.Item
                                        label="Giá gốc"
                                            name="price"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Giá không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                        label="Phần trăm giảm giá"
                                            name="percent_sale"
                                          
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                        label="Số lượng"
                                            name="amount"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Số lượng không được để trống!',
                                                },
                                            ]}
                                        >
                                            <Input />

                                        </Form.Item>
                                        <Form.Item
                                        label="Thời gian bảo hành"
                                            name="warranty"
                                             rules={[
                                                {
                                                    required: true,
                                                    message: 'Bảo hành không được để trống!',
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