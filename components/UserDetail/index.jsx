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
          message.loading({ content: "??ang c???p nh???t", key });
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
      //?????a ch???
      
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
          message.error({ content: "l???i th??nh ph???", key })
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
          message.error({ content: "l???i qu???n", key })
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
          message.error({ content: "l???i ph?????ng", key })
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

    // ?????i m???t kh???u
    const showModalPass = () => {
        setIsModalPass(true);
      };
    
      const handleOkPass = async (values) => {
        try {
          message.loading({ content: "??ang c???p nh???t", key });
    
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
       
        message.loading({ content: "??ang l???i li??n k???t c???p nh???t Google", key });
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
          title="Th??ng tin ng?????i d??ng"
          bordered
          className=""
         
        >
          <Descriptions.Item label="H??? v?? t??n" span={3}>
            {user.name}
          </Descriptions.Item>
          <Descriptions.Item label="S??? ??i???n tho???i" span={3}>
            {user.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email"span={3}>
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label="Ng??y sinh"span={3}>
          {moment(user.birthdate).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="?????a ch???"span={3}>
            {user.address}
          </Descriptions.Item>
          <Descriptions.Item label="Li??n k???t Google"span={3}>
          {user.google_id=== "" && <div className="w-auto flex justify-between">
              <div className="font-medium">Kh??ng c?? li??n k???t</div>
              <GoogleLogin
                                clientId="1006982726767-iah4u9p4ubsg55viarbe8ike0s6nlquj.apps.googleusercontent.com"

                                onSuccess={onChangeGG}
                                onFailure={onChangeGG}

                                cookiePolicy={'single_host_origin'}
                                buttonText="Li??n k???t"
                            />
              </div>}
            {user.google_id  &&<div className="w-auto flex justify-between">
              <div className="text-green-500 font-medium ">???? li??n k???t</div>
              <Button style={{color:"red"}} onClick={() => offChangeGG()}>H???y li??n k???t</Button>
              </div>
              
           }
          </Descriptions.Item>
          <Descriptions.Item label="Li??n k???t Facebook"span={3}>
            {user.facebook_id=== "" &&<div className="w-auto flex justify-between">
              <div className="font-medium">Kh??ng c?? li??n k???t</div>
              <FacebookLogin
                                appId="513023080467374"

                                textButton="Li??n k???t"
                                fields="name,email,picture"
                                icon={<FacebookOutlined style={{ marginRight: "20px", fontSize: "20px" }} />}
                                cssClass="btnLKFacebook"

                                callback={onChangeFB}
                                size="small"
                            />
              </div>}
            {user.facebook_id  && <div className="w-auto flex justify-between">
              <div className="text-green-500 font-medium ">???? li??n k???t</div>
              <Button style={{color:"red"}} onClick={() => offChangeFB()}>H???y li??n k???t</Button>
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
            ?????i th??ng tin
          </Button>
          <Button
            className="  flex items-center"
            shape="round"
            icon={<KeyOutlined />}
            size="large"
            style={{background:"#4682B4",color:"white",}}
             onClick={showModalPass}
          >
            ?????i m???t kh???u
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
          <h1 className="text-center text-xl pb-4">C???p nh???p m???t kh???u</h1>
          <Form.Item
            label="M???t kh???u c??"
            name="oldPassword"
            rules={[
              {
                required: true,
                message:
                  "M???t kh???u c?? kh??ng ???????c ????? tr???ng v?? ????? d??i tr??n 6 k?? t???!",
                min: 6,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="M???t kh???u m???i"
            name="newPassword"
            rules={[
              {
                required: true,
                message:
                  "M???t kh???u m???i kh??ng ???????c ????? tr???ng v?? ????? d??i tr??n 6 k?? t???!",
                min: 6,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Nh???p l???i m???t kh???u m???i"
            name="repeatPassword"
            rules={[
              {
                required: true,
                message:
                  "M???t kh???u m???i kh??ng ???????c ????? tr???ng v?? ????? d??i tr??n 6 k?? t???!",
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