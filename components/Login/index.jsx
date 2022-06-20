import React, { useEffect, useState } from 'react';
import Router from 'next/router'
import { message, Select } from 'antd';
import { useRecoilState } from 'recoil';
import classNames from "classnames";

import LoginNormal from './loginNormal';
import LoginGG from './loginGoogle';
import LoginFB from './loginFacebook';
import SignUp from './signup';
import DefaultLayout from '../../layouts/Default'
import apiService from '../../utils/api/apiService';
import { userState } from '../../store/userState';
import axios from 'axios';


export default function Login() {
    const [user, setUser] = useRecoilState(userState);
    const [tab, setTab] = useState("dang-nhap");
    const [tabSignUp, setTabSignUp] = useState("tai-khoan");
    const [hover, setHover] = useState(false);
    const [addressVN, setAddressVN] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState({})
    const [districtVN, setDistrictVN] = useState([]);
    const [selectDistrict, setSelectedDistrict] = useState({})
    const [wardsVN, setWardsVN] = useState([]);
    const [selectWards, setSelectedWards] = useState({})
    const [current, setCurrent] = React.useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const steps = [
        {
            title: 'Tài khoản',
            content: 'tai-khoan',
        },
        {
            title: 'Thông tin',
            content: 'thong-tin',
        },
        {
            title: 'Địa chỉ',
            content: 'dia-chi',
        },
        {
            title: 'Số điện thoại',
            content: 'so-dien-thoai',
        },
    ];
    const handleLogin = async (values) => {
        const key = "login";

        try {
            message.loading({ content: "Đang đăng nhập", key })
            await apiService.post('/auths/login', values);
            const response = await apiService.get('/users/me');
            setUser(response.data);
            message.success({ content: "Đăng nhập thành công", key })
        } catch (error) {
            message.error({ content: error.response.data.message, key })
        }

    };
    const handleLoginGG = async (values) => {

        const key = "login";

        try {
            if (values.tokenId) {
                message.loading({ content: "Đang đăng nhập", key })
                await apiService.post('/auths/login-gg', { ...values, token: values.tokenId });
                console.log(values);
                const response = await apiService.get('/users/me');
                console.log(response.data);
                setUser(response.data);
                message.success({ content: "Đăng nhập thành công", key })
            }
        } catch (error) {
            message.error({ content: error.response.data.message, key })
        }

    };
    const handleLoginFB = async (values) => {

        const key = "login";

        try {
            if (values.accessToken) {
                message.loading({ content: "Đang đăng nhập", key })
                await apiService.post('/auths/login-fb', { ...values, token: values.accessToken });
                console.log(values);
                const response = await apiService.get('/users/me');
                console.log(response.data);
                setUser(response.data);
                message.success({ content: "Đăng nhập thành công", key })
            }
        } catch (error) {
            message.error({ content: error.response.data.message, key })
        }

    };
    const handleRegister = async (values) => {
        const key = "/";
        try {
            message.loading({ content: "Đang đăng kí", key })
            console.log(values);
            const { name: district } = selectDistrict;
            const { name: city } = selectedAddress;
            const { name: wards } = selectWards;
            const result = `${city}, ${district}, ${wards}, ${values.address}`;
            await apiService.post('/users/sign-up', { ...values, address: result });

            message.success({ content: "Vui lòng kiểm tra gmail", key })
        } catch (error) {
            message.error({ content: error.response.data.message, key })
        }

    };

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
            console.log(response);
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
            console.log(response);
        } catch (error) {
            message.error({ content: "lỗi phường", key })
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
        if (user.user_id) {
            Router.push('/')
        }
    }, [user])

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

    return (
        <div className='flex h-screen justify-center bg-cover bg-center relative'
            style={{
                backgroundImage: `url(https://wallpaperaccess.com/full/3277278.jpg)`,
            }}
        >

            <div style={{ top: tab === 'dang-nhap' ? '30%' : '45%' }} className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 my-10 p-14 bg-white rounded-xl hover:shadow-xl z-0 ">
                <div className='flex justify-center space-x-14' >
                    <LoginGG handleLoginGG={handleLoginGG} />
                    <LoginFB handleLoginFB={handleLoginFB} />
                </div>

                <p className='text-center text-lg my-4'>Hoặc</p>

                <div className="text-center  text-xl font-normal" style={{ fontFamily: "muli,sans-serif" }}>
                    <div className="inline-block mr-10"
                    >
                        <p
                            className={classNames("cursor-pointer", {
                                "text-2xl text-blue-500": tab === "dang-nhap",
                            }, {
                                "text-xl": hover === "dang-ki",
                            })}
                            onClick={() => setTab("dang-nhap")}
                        >
                            Đăng nhập
                        </p>
                    </div>
                    <div className="inline-block "
                    >
                        <p
                            className={classNames("cursor-pointer", {
                                "text-2xl text-green-500": tab === "dang-ki",
                            })}
                            onClick={() => setTab("dang-ki")}
                        >
                            Đăng kí
                        </p>
                    </div>
                </div>

                {tab === "dang-nhap" &&
                    <LoginNormal handleLogin={handleLogin} onFinishFailed={onFinishFailed} />
                }
                {tab === "dang-ki" &&
                    <SignUp handleRegister={handleRegister} onFinishFailed={onFinishFailed} addressVN={addressVN} selectedAddress={selectedAddress}
                        handleSelectAddress={handleSelectAddress} districtVN={districtVN} selectDistrict={selectDistrict} handleSelectDistrict={handleSelectDistrict}
                        wardsVN={wardsVN} selectWards={selectWards} handleSelectWards={handleSelectWards} current={current} next={next} prev={prev}
                        tabSignUp={tabSignUp} setTabSignUp={setTabSignUp} steps={steps} />
                }
            </div>
        </div>
    )
}