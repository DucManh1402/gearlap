import React, { useState, useEffect } from "react";
import { Modal,Upload, Form, Input, Select,Button,Spin } from "antd";
import { UploadOutlined} from '@ant-design/icons';

const { Option } = Select;

const EditProduct = ({ deleteImage,handleChangeImage,showModalEdit, setShowModalEdit, productDetail, updateProducts,categories, brands }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (showModalEdit) {
      form.setFieldsValue({
        ...productDetail,
      });
    }
  }, [showModalEdit]);

  const handleUpdate = () => {
    form.validateFields()
      .then(values => {
        updateProducts(productDetail.product_id, values)
      })
  }
  const fileList = [
    {
      uid: '-1',
      name: 'image.jpe',
      status: 'done',
      url: productDetail.image,
      thumbUrl: productDetail.image,
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
                                            <Select defaultValue={productDetail.type_id} >
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
                                            <Select defaultValue={productDetail.brand_id}>

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
                                    
      </Form>
      </div>
    </Modal>
  </>
);
};

export default EditProduct;
