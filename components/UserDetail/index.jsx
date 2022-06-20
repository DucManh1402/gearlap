import React, { useEffect, useState } from "react";
import {
    Descriptions,
    Button,
    Modal,
    Form,
    Input,
    message,
  } from "antd";
import { KeyOutlined, HistoryOutlined,HomeOutlined,EditOutlined, FacebookOutlined } from "@ant-design/icons";

import { useRecoilState } from "recoil";

import DefaultLayout from '../../layouts/Default'
import apiService from "../../utils/api/apiService";
import { userState } from "../../store/userState";
import moment from 'moment';
import EditProfile from "./editProfile";
import axios from 'axios';
import Router from 'next/router'
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

export default function UserDetail() {
    const [user, setUser] = useRecoilState(userState);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalPass, setIsModalPass] = useState(false);
    const [addressVN, setAddressVN] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState({})
    const [districtVN, setDistrictVN] = useState([]);
    const [selectDistrict, setSelectedDistrict] = useState({})
    const [wardsVN, setWardsVN] = useState([]);
    const [selectWards, setSelectedWards] = useState({})
    const [form] = Form.useForm();
    const key = "fetching";
    

    useEffect(() => {
   
        const user = JSON.parse(localStorage.getItem("user"));
    
        if (user) {
          setUser(user);
        }else{
          Router.push('/');
        }
  
      }, []);
  
      useEffect(() => {
  
        if (isModalVisible) {

          const diachi =  user.address.split(',');
          setSelectedAddress({name: diachi.slice(0,1)});
          setSelectedDistrict({name: diachi.slice(1,2)});
          setSelectedWards({name:diachi.slice(2,3)});
          form.setFieldsValue({
             ...user, birthdate: moment(user.birthdate, 'YYYY/MM/DD'), city: diachi.slice(0,1),district:diachi.slice(1,2),wards:diachi.slice(2,3) , address: diachi.splice(3)
            // ...user, birthdate: moment(user.birthdate, 'YYYY/MM/DD'), address: diachi.splice(3)
          });
        }
      }, [isModalVisible]);
    
      const showModal = () => {
        setIsModalVisible(true);
      };
      const handleOk = async (values) => {
        try {
          message.loading({ content: "Đang cập nhật", key });
          const { name: district } = selectDistrict;
            const { name: city } = selectedAddress;
            const { name: wards } = selectWards;
            const result = `${city}, ${district}, ${wards}, ${values.address}`;
    
          const response = await apiService.post(`/users/update`,{name:values.name,birthdate:moment(values.birthdate,'YYYY/MM/DD'),phone:values.phone, address: result});
          setUser({...user,...values, address: result });
          //Destructuring
          message.success({ content: response.data.message, key });
          setIsModalVisible(false);
        } catch (error) {
          message.error({ content: error.response.data.message, key });
        }
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };
      //
      // function onChangeGG(checked) {
      //   console.log(`switch to ${checked}`);
      // }
      //địa chỉ
      
const getAddressVN = async () => {
      const key = "fetch";
      try {
          const url = "https://provinces.open-api.vn/api/p"
          const response = await axios.get(url);
          const result = response.data.map(({ code, codename, name }) => {
              return { code, codename, name }
          })

          setAddressVN(result);

      } catch (error) {
          message.error({ content: "lỗi thành phố", key })
      }

  };

  const getDistrictVN = async ({ code }) => {
      const key = "fetch";
      try {
          const url = `https://provinces.open-api.vn/api/p/${code}?depth=2`
          const response = await axios.get(url);
          const result = response.data.districts.map(({ code, codename, name }) => {
              return { code, codename, name }
          })
          setDistrictVN(result);
      } catch (error) {
          message.error({ content: "lỗi quận", key })
      }

  };
  const getWardsVN = async ({ code }) => {
      const key = "fetch";
      try {
          const url = `https://provinces.open-api.vn/api/d/${code}?depth=2`
          const response = await axios.get(url);
          const result = response.data.wards.map(({ code, codename, name }) => {
              return { code, codename, name }
          })
          setWardsVN(result);
      } catch (error) {
          message.error({ content: "lỗi phường", key })
      }

  };
    function handleSelectAddress(value) {
      const selectAddress = addressVN.find(address => address.codename === value);
      setSelectedAddress(selectAddress);
  }

  function handleSelectDistrict(value) {
      const selectDistrict = districtVN.find(district => district.codename === value);
      setSelectedDistrict(selectDistrict);
  }

  function handleSelectWards(value) {
      const selectWards = wardsVN.find(wards => wards.codename === value);
      setSelectedWards(selectWards);
  }
  
  useEffect(() => {
    getAddressVN();
}, [])

useEffect(() => {
    if (selectedAddress?.codename) {
        getDistrictVN(selectedAddress);
        setSelectedDistrict({});
        setSelectedWards({});
    }
}, [selectedAddress])

useEffect(() => {
    if (selectDistrict?.codename) {
        getWardsVN(selectDistrict);
        setSelectedWards({});
    }
}, [selectDistrict])

    // đổi mật khẩu
    const showModalPass = () => {
        setIsModalPass(true);
      };
    
      const handleOkPass = async (values) => {
        try {
          message.loading({ content: "Đang cập nhật", key });
    
          const response = await apiService.post(`/users/update-password`, values);
          //   console(response);
    
          message.success({ content: response.data.message, key });
          // message.error({ content: response.data.message, key });
          setIsModalPass(false);
        } catch (error) {
            message.error({ content: error.response.data.message, key })
        }
      };
    
      const handleCancelPass = () => {
        setIsModalPass(false);
      };
    //test gg
    const onChangeGG  = async (values) => {
  
      try {
        const response = await apiService.post(`/users/sync-gg`,{...values, token: values.tokenId});
        const responseUser = await apiService.get('/users/me');
        setUser(responseUser.data); 
        console.log(user.data);
        //Destructuring
        message.success({ content: response.data.message, key });
     
      } catch (error) {
        message.error({ content: error.response.data.message, key });
      }
    };
    const onChangeFB  = async (values) => {
 
      try {
        const response = await apiService.post(`/users/sync-fb`,{...values, token: values.accessToken });
        const responseUser = await apiService.get('/users/me');
        setUser(responseUser.data); 
        console.log(user.data);
        //Destructuring
        message.success({ content: response.data.message, key });
     
      } catch (error) {
        message.error({ content: error.response.data.message, key });
      }
    };
    const offChangeGG  = async () => {
      try {
       
        message.loading({ content: "Đang lại liên kết cập nhật Google", key });
        const response = await apiService.post(`/users/unsync`,{type: 'gg'});
        const responseUser = await apiService.get('/users/me');
        setUser(responseUser.data);
        //Destructuring
        message.success({ content: response.data.message, key });
        // console.log(user);
      } catch (error) {
        message.error({ content: error.response.data.message, key });
      }

    };

  const offChangeFB  = async () => {
    try {
      const response = await apiService.post(`/users/unsync`,{type: "fb"});
      const responseUser = await apiService.get('/users/me');
      setUser(responseUser.data);
      //Destructuring
      message.success({ content: response.data.message, key });
   
    } catch (error) {
      message.error({ content: error.response.data.message, key });
    }
  };

    return (
        <DefaultLayout>
            <div className="my-6 mx-6 px-8 py-8 bg-white rounded-lg hover:shadow-xl ">
    <Descriptions
          title="Thông tin người dùng"
          bordered
          className=""
         
        >
          <Descriptions.Item label="Họ và tên" span={3}>
            {user.name}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại" span={3}>
            {user.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email"span={3}>
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh"span={3}>
          {moment(user.birthdate).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ"span={3}>
            {user.address}
          </Descriptions.Item>
          <Descriptions.Item label="Liên kết Google"span={3}>
          {user.google_id=== "" && <div className="w-auto flex justify-between">
              <div className="font-medium">Không có liên kết</div>
              <GoogleLogin
                                clientId="1006982726767-iah4u9p4ubsg55viarbe8ike0s6nlquj.apps.googleusercontent.com"

                                onSuccess={onChangeGG}
                                onFailure={onChangeGG}

                                cookiePolicy={'single_host_origin'}
                                buttonText="Liên kết"
                            />
              </div>}
            {user.google_id  &&<div className="w-auto flex justify-between">
              <div className="text-green-500 font-medium ">Đã liên kết</div>
              <Button style={{color:"red"}} onClick={() => offChangeGG()}>Hủy liên kết</Button>
              </div>
              
           }
          </Descriptions.Item>
          <Descriptions.Item label="Liên kết Facebook"span={3}>
            {user.facebook_id=== "" &&<div className="w-auto flex justify-between">
              <div className="font-medium">Không có liên kết</div>
              <FacebookLogin
                                appId="513023080467374"

                                textButton="Liên kết"
                                fields="name,email,picture"
                                icon={<FacebookOutlined style={{ marginRight: "20px", fontSize: "20px" }} />}
                                cssClass="btnLKFacebook"

                                callback={onChangeFB}
                                size="small"
                            />
              </div>}
            {user.facebook_id  && <div className="w-auto flex justify-between">
              <div className="text-green-500 font-medium ">Đã liên kết</div>
              <Button style={{color:"red"}} onClick={() => offChangeFB()}>Hủy liên kết</Button>
              </div>}
          </Descriptions.Item>
        </Descriptions>
        <div className="mt-6 space-x-6 flex">
        <Button
            className="  flex items-center"
            shape="round"
            icon={<EditOutlined />}
            size="large"
            style={{background:"#0096FF",color:"white"}}
            onClick={showModal}
          >
            Đổi thông tin
          </Button>
          <Button
            className="  flex items-center"
            shape="round"
            icon={<KeyOutlined />}
            size="large"
            style={{background:"#4682B4",color:"white",}}
             onClick={showModalPass}
          >
            Đổi mật khẩu
          </Button>
      
        </div>
            </div>
           <EditProfile isModalVisible={isModalVisible} form={form} handleCancel={handleCancel} handleOk = {handleOk} addressVN={addressVN} selectedAddress={selectedAddress}
                            handleSelectAddress={handleSelectAddress} districtVN={districtVN} selectDistrict={selectDistrict} handleSelectDistrict={handleSelectDistrict}
                            wardsVN={wardsVN} selectWards={selectWards} handleSelectWards={handleSelectWards}/>
      <Modal
        visible={isModalPass}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleOkPass(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        onCancel={handleCancelPass}
      >
        <Form form={form} layout="vertical" name="basic" autoComplete="off">
          <h1 className="text-center text-xl pb-4">Cập nhập mật khẩu</h1>
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[
              {
                required: true,
                message:
                  "Mật khẩu cũ không được để trống và độ dài trên 6 kí tự!",
                min: 6,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              {
                required: true,
                message:
                  "Mật khẩu mới không được để trống và độ dài trên 6 kí tự!",
                min: 6,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu mới"
            name="repeatPassword"
            rules={[
              {
                required: true,
                message:
                  "Mật khẩu mới không được để trống và độ dài trên 6 kí tự!",
                min: 6,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>


        </DefaultLayout>
        
    );
}