import React from 'react';
import {
    Modal,
    Form,
    Input,
    DatePicker,
    Select
  } from "antd";
export default function  EditProfile ({isModalVisible,form,handleCancel,handleOk,addressVN,selectedAddress,handleSelectAddress,
    districtVN,selectDistrict,handleSelectDistrict,wardsVN,selectWards,handleSelectWards})  {
        const { Option } = Select
        return(
            <>
               <Modal
        visible={isModalVisible}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleOk(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="basic" autoComplete="off">
          <h1 className="text-center text-xl pb-4">Cập nhập thông tin</h1>

          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Họ và tên không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
          label="Ngày sinh"
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
                                <Form.Item
                                label="Địa chỉ"
                                    name="city"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'thành phố không được để trống!',
                                        },
                                    ]}
                                >
                                        <Select defaultValue="" value={selectedAddress?.codename || ""}  onChange={handleSelectAddress} >
                                        {/* <Option value={selectedAddress}>{selectedAddress}</Option> */}
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
                                    <Select defaultValue="" value={selectDistrict?.codename || ""} disabled={selectedAddress?.codename && districtVN?.length !== 0 ? false : true}
                                          onChange={handleSelectDistrict}>
                                                {/* <Option value={selectDistrict}>{selectDistrict}</Option>  */}
                                        { districtVN.map(district => {
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
                                      <Select defaultValue="" value={selectWards?.codename || ""} disabled={selectedAddress?.codename && selectDistrict?.codename && wardsVN?.length !== 0 ? false : true}
                                          onChange={handleSelectWards}>
                                       
                                       {/* <Option value="">${selectWards}</Option> */}
                                      {wardsVN.map(wards => {
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
                                   
                                    <Input  placeholder="Số nhà, đường" />
                                    </Form.Item>
                                 
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Số điện thoại có độ dài là 10 số!",
                len: 10,
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

        </Form>
      </Modal>
            </>
        )
   
}