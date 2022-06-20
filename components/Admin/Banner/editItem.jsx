import React, { useState, useEffect } from "react";
import { Modal,Upload, Form, Input, Select,Button,Spin } from "antd";
import { UploadOutlined} from '@ant-design/icons';

const { Option } = Select;

const EditItem = ({ deleteImage,handleChangeImage,showModalEdit, setShowModalEdit, bannerDetail, updateBanners }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (showModalEdit) {
      form.setFieldsValue({
        ...bannerDetail,
      });
    }
  }, [showModalEdit]);

  const handleUpdate = () => {
    form.validateFields()
      .then(values => {
        updateBanners(bannerDetail.banner_id, values)
      })
  }
  const fileList = [
    {
      uid: '-1',
      name: 'image.jpe',
      status: 'done',
      url: bannerDetail.url,
      thumbUrl: bannerDetail.url,
    },
  ];
  return (
    <>

      <Modal

        title="Chỉnh sửa banner"
        visible={showModalEdit}
        onOk={handleUpdate}
        onCancel={() => setShowModalEdit(false)}
      >
         <div className="flex flex-col space-y-4">
        <Upload
            fileList={fileList}
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
        <Form form={form} layout="vertical" className=" mx-auto">
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
        </Form>
        </div>
      </Modal>
    </>
  );
};

export default EditItem;
