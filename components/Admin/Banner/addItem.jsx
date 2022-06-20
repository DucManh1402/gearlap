import React, { useState,useEffect } from 'react'
import {  Upload, Modal, Button,Spin,Input,Form} from "antd";
import { UploadOutlined} from '@ant-design/icons';

export default function AddItem({deleteImage,handleChangeImage,onFinishFailed,isModalAddItem,handleCancelAddItem,handleaddBanner}) {
    return(
        <div >
             <Modal title="Thêm nền banner" visible={isModalAddItem}  onCancel={handleCancelAddItem}    footer={null}
      
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
                                 onFinish={handleaddBanner}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >  
            <Form.Item
                                    name="link"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Link chuyển hướng không được để trống!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Link chuyển hướng"/>
                                </Form.Item>
                                <Form.Item
                                    className="text-center"
                                >
                                    <Button htmlType="submit" style={{ width: "100%" }} >Lưu dữ liệu</Button>
                                </Form.Item>
       
       </Form>
       </div>
         </Modal>
        </div>
    )
}
