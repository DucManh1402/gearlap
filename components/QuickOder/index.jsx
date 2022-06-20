import React, { useState, useEffect } from 'react'
import { Divider, Table, Input, Button, Radio, InputNumber, Space, Popconfirm, Typography, Steps, Form, Result, message, Select } from "antd";
import { CloseOutlined, ShoppingCartOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import numberFormat from '../../utils/modules/numberFormat';
import { useRecoilState } from 'recoil';
import DefaultLayout from '../../layouts/Default';

import apiService from '../../utils/api/apiService';
import Information from './Information';
import { orderState } from '../../store/orderState';
import { uuid } from 'uuidv4';
import { userState } from '../../store/userState';
import { useRouter } from 'next/router';
import axios from 'axios';

const { Text, Title, Link } = Typography;
const { Step } = Steps;
const { Option } = Select;
const key = 'fetching';
export default function QuickOder() {
    const [user, setUser] = useRecoilState(userState);

    const [form] = Form.useForm();
    const [status, setStatus] = useState('pending');
    const [shipping, setShipping] = useState(0);
    const [timeline, setTimeline] = useState('');
    const [carrier, setCarrier] = useState('');
    const [method, setMethod] = useState('cod');
    const key = "fetching";
    const router = useRouter();
    const [orders, setOrders] = useRecoilState(orderState);
    const [addressVN, setAddressVN] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState({})
    const [districtVN, setDistrictVN] = useState([]);
    const [selectDistrict, setSelectedDistrict] = useState({})
    const [wardsVN, setWardsVN] = useState([]);
    const [selectWards, setSelectedWards] = useState({})

    const total = orders.reduce((acc, curItem) => {
        return acc + curItem.soluong * curItem.price_now
    }, 0)

    const onChangeQuantity = (record, value) => {
        const index = orders.findIndex(item => item.product_id === record.product_id);
        const ordersArray = [...orders];
        ordersArray[index] = { ...record, soluong: value };
        setOrders(ordersArray);
    }

    const deleteProduct = (record) => {
        const index = orders.findIndex(item => item.product_id === record.product_id);
        const ordersArray = [...orders];
        ordersArray.splice(index, 1);
        localStorage.setItem('orders', JSON.stringify(ordersArray));
        setOrders(ordersArray);
    }
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'image',
            key: 'image',
            render: img => <div className="flex items-center">
                <img width={120} src={img} alt="ảnh sản phẩm" />
            </div>,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },

        {
            title: 'Giá hiện tại',
            dataIndex: 'price_now',
            key: 'price_now',
            render: price => <span>{numberFormat(price)} đồng</span>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'soluong',
            key: 'soluong',
            render: (value, record) => <InputNumber min={1} max={parseInt(record.amount)} defaultValue={value}
                value={value} onChange={(newValue) => onChangeQuantity(record, newValue)} />,
        },
        {
            title: '',
            key: 'delete',
            render: (text, record) => (
                <Space size="middle">

                    <Popconfirm
                        title={`Chắc chắn xóa?`}
                        onConfirm={() => deleteProduct(record)}
                        okText={'Xóa'}
                        cancelText="Hủy"
                    >
                        <CloseOutlined style={{ color: "red" }} />
                    </Popconfirm>


                </Space>
            ),
        }
    ];

    const getShippingFee = async () => {
        try {
            message.loading({ content: "Đang tính phí ship...", key })
            const response = await apiService.post('/payments/ship/fee', {
                toCityName: selectedAddress.name,
                toDistrictName: selectDistrict.name,
                codMoney: total,
            })
            response.data.sort((a, b) => {
                return b.shipFee - a.shipFee;
            });
            setShipping(response.data[0]?.shipFee);
            setTimeline(response.data[0]?.serviceDescription);
            setCarrier(response.data[0]?.carrierName);
            message.success({ content: "Đã tính", key })
        } catch (error) {
            message.error({ content: "Có lỗi xảy ra", key })
        }
    }

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

    const handleSubmit = async (info) => {
        const newAddress = `${selectedAddress.name}, ${selectDistrict.name}, ${selectWards.name}, ${info.addressInput}`;

        if (orders.length === 0) {
            message.error({ content: "Vui lòng đặt sản phẩm", key })
        } else {
            const listproduct = orders.map(({ product_id, soluong }) => {
                return { product_id, quantity: soluong };
            })
            try {
                const infoIfNotLogin = { ...user, ...info }
                localStorage.removeItem('orders');
                setOrders([])
                message.loading({ content: "Đang xử lý...", key });
                switch (method) {
                    case 'cod':
                        (async () => {
                            const response = await apiService.post('/orders', {
                                ...infoIfNotLogin, address: newAddress, method: 'Tiền mặt', transport_fee: shipping, listproduct
                            })
                            message.success({ content: response.data.message, key })
                            setStatus('done');
                        })()
                        return

                    case 'momo':
                        (async () => {
                            const response = await apiService.post('/payments/momo', {
                                ...infoIfNotLogin, address: newAddress, method: 'Momo', transport_fee: shipping, listproduct
                            })
                            router.push(response.data.url);
                        }
                        )()
                        return
                }


            } catch (error) {
                message.error({ content: error.response.data.message.toString(), key })

            }
        }

    }

    useEffect(() => {
        if (user.user_id) {
            form.setFieldsValue(user);
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
        <DefaultLayout>
            <div className='flex flex-col items-center'>
                <Steps className='mt-7 w-3/12' size="small" >
                    <Step status={status === 'pending' ? "process" : "finish"} title="Chi tiết giỏ hàng" icon={<ShoppingCartOutlined />} />
                    <Step status={status === 'done' ? 'finish' : 'wait'} title="Đặt hàng thành công" icon={<CheckCircleOutlined />} />
                </Steps>

                {status === 'pending' && <div className="flex bg-white rounded-lg hover:shadow-xl m-8 w-11/12">
                    <div className='w-1/2'>
                        <Table
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: () => {
                                        // setShowModalEdit(true)
                                        // setProductDetail(record)
                                    }
                                }
                            }
                            }
                            pagination={false}
                            columns={columns}
                            dataSource={orders}
                            scroll={{ y: 600 }}
                        />

                    </div>
                    <div className="bg-gray-100 w-1/2 flex flex-col text-center space-y-4 p-4">
                        <div className='flex justify-between mb-2'>
                            <div className='text-xl font-semibold' > Thông tin liên lạc</div>
                        </div>
                        <Form
                            layout="vertical"
                            name="basic"
                            form={form}
                            onFinish={handleSubmit}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Email không được để trống',
                                    },
                                ]}
                            >
                                <Input placeholder="Email" disabled={user.email} />
                            </Form.Item>
                            <div className='flex space-x-4'>
                                <Form.Item
                                    className='w-1/2'
                                    label="Họ và tên"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên đầy đủ không được để trống!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Họ và tên" />
                                </Form.Item>
                                <Form.Item
                                    className='w-1/2'
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Số điện thoại có độ dài là 10 số!',
                                            len: 10,
                                        },
                                    ]}
                                >
                                    <Input type="number" placeholder="Số điện thoại" />
                                </Form.Item>
                            </div>
                            <div className='flex space-x-4'>

                                <Form.Item
                                    className='w-1/2'
                                    name="city"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'thành phố không được để trống!',
                                        },
                                    ]}
                                >
                                    <Select defaultValue="" value={selectedAddress?.codename || ""} onChange={handleSelectAddress}>
                                        <Option value="">-Chọn Thành Phố-</Option>
                                        {addressVN.map(address => {
                                            return <Option value={address.codename}>{address.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    className='w-1/2'

                                    name="district"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Quận/huyện không được để trống!',
                                        },
                                    ]}
                                >
                                    <Select value={selectDistrict?.codename || ""} disabled={selectedAddress?.codename && districtVN?.length !== 0 ? false : true}
                                        defaultValue="" onChange={handleSelectDistrict}>
                                        <Option value="">-Chọn Quận-</Option>
                                        {districtVN === null && <Option value="">-Chọn Quận-</Option>}
                                        {districtVN && districtVN.map(district => {
                                            return <Option value={district.codename}>{district.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className='flex space-x-4'>

                                <Form.Item
                                    className='w-1/2'

                                    name="wards"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Phường/xã không được để trống!',
                                        },
                                    ]}
                                >
                                    <Select value={selectWards?.codename || ""} disabled={selectedAddress?.codename && selectDistrict?.codename && wardsVN?.length !== 0 ? false : true}
                                        defaultValue="" onChange={handleSelectWards}>
                                        <Option value="">-Chọn Phường-</Option>
                                        {wardsVN === null && <Option value="">-Chọn Phường-</Option>}
                                        {wardsVN && wardsVN.map(wards => {
                                            return <Option value={wards.codename}>{wards.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    className='w-1/2'

                                    name="addressInput"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'số, đường không được để trống!',
                                        },
                                    ]}
                                >

                                    <Input
                                        onBlur={getShippingFee}
                                        disabled={selectedAddress?.codename && selectDistrict?.codename && selectWards?.codename ? false : true}
                                        placeholder="Số nhà, đường" />

                                </Form.Item>
                            </div>
                        </Form>
                        <Divider />
                        <div className='flex justify-between'>
                            <div className='text-base font-medium' >Phương thức thanh toán</div>
                            <div>
                                <Radio.Group value={method} onChange={(e) => setMethod(e.target.value)}>
                                    <Radio optionType="button" value="cod">Thanh toán khi nhận hàng</Radio>
                                    <Radio optionType="button" value="momo">Ví momo</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                        <Divider />
                        <div className='flex justify-between'>
                            <div className='text-sm'>Tổng sản phẩm</div>
                            <div className='text-sm'>{numberFormat(total)}đ</div>
                        </div>
                        <div className='flex justify-between'>
                            <div className='text-sm' >Tiền ship</div>
                            <div className='text-sm'>{shipping ? `${numberFormat(shipping)}đ` : 'Vui lòng nhập đủ thông tin'}</div>
                        </div>
                        <div className='flex justify-between'>
                            <div className='text-sm' >Đơn vị vận chuyển</div>
                            <div className='text-sm'>{carrier ? carrier : 'Vui lòng nhập đủ thông tin'}</div>
                        </div>
                        <div className='flex justify-between'>
                            <div className='text-sm' >Thời gian dự kiến</div>
                            <div className='text-sm'>{!timeline ? 'Vui lòng nhập đủ thông tin' : timeline.includes('ngày') ? timeline : '1 ngày'}</div>
                        </div>
                        <Divider />
                        <div className='flex justify-between my-5'>
                            <div className=' '>Tổng</div>
                            <div className='font-semibold text-xl'>{numberFormat(total + shipping)}đ</div>
                        </div>
                        <Form.Item
                            className="text-center"
                        >
                            <Button disabled={!shipping}
                                type="primary" onClick={() => {
                                    if (total + shipping >= 30000000 && method === "momo") {
                                        message.info({ content: "Số tiền quá lớn không thể thanh toán qua Momo", key })
                                        setMethod('cod');
                                    } else {
                                        form.submit()
                                    }
                                }} style={{ width: "100%" }}>
                                Xác nhận</Button>
                        </Form.Item>
                    </div>

                </div>}

                {status === 'done' && <div className="flex bg-white rounded-lg hover:shadow-xl m-8 w-11/12">
                    <Result className='w-full my-20'
                        status="success"
                        title="Bạn đã mua hàng thành công"
                        subTitle="Hệ thống sẽ gửi hóa đơn vào gmail trong vài phút"
                        extra={[
                            <Button onClick={() => router.push('/')} type="primary" key="console">
                                Trang chủ
                            </Button>
                        ]}
                    />

                </div>}
            </div>


        </DefaultLayout>
    )
}