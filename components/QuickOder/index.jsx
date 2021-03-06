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
            title: 'S???n ph???m',
            dataIndex: 'image',
            key: 'image',
            render: img => <div className="flex items-center">
                <img width={120} src={img} alt="???nh s???n ph???m" />
            </div>,
        },
        {
            title: 'T??n s???n ph???m',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },

        {
            title: 'Gi?? hi???n t???i',
            dataIndex: 'price_now',
            key: 'price_now',
            render: price => <span>{numberFormat(price)} ?????ng</span>,
        },
        {
            title: 'S??? l?????ng',
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
                        title={`Ch???c ch???n x??a?`}
                        onConfirm={() => deleteProduct(record)}
                        okText={'X??a'}
                        cancelText="H???y"
                    >
                        <CloseOutlined style={{ color: "red" }} />
                    </Popconfirm>


                </Space>
            ),
        }
    ];

    const getShippingFee = async () => {
        try {
            message.loading({ content: "??ang t??nh ph?? ship...", key })
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
            message.success({ content: "???? t??nh", key })
        } catch (error) {
            message.error({ content: "C?? l???i x???y ra", key })
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

    const handleSubmit = async (info) => {
        const newAddress = `${selectedAddress.name}, ${selectDistrict.name}, ${selectWards.name}, ${info.addressInput}`;

        if (orders.length === 0) {
            message.error({ content: "Vui l??ng ?????t s???n ph???m", key })
        } else {
            const listproduct = orders.map(({ product_id, soluong }) => {
                return { product_id, quantity: soluong };
            })
            try {
                const infoIfNotLogin = { ...user, ...info }
                localStorage.removeItem('orders');
                setOrders([])
                message.loading({ content: "??ang x??? l??...", key });
                switch (method) {
                    case 'cod':
                        (async () => {
                            const response = await apiService.post('/orders', {
                                ...infoIfNotLogin, address: newAddress, method: 'Ti???n m???t', transport_fee: shipping, listproduct
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
                    <Step status={status === 'pending' ? "process" : "finish"} title="Chi ti???t gi??? h??ng" icon={<ShoppingCartOutlined />} />
                    <Step status={status === 'done' ? 'finish' : 'wait'} title="?????t h??ng th??nh c??ng" icon={<CheckCircleOutlined />} />
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
                            <div className='text-xl font-semibold' > Th??ng tin li??n l???c</div>
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
                                        message: 'Email kh??ng ???????c ????? tr???ng',
                                    },
                                ]}
                            >
                                <Input placeholder="Email" disabled={user.email} />
                            </Form.Item>
                            <div className='flex space-x-4'>
                                <Form.Item
                                    className='w-1/2'
                                    label="H??? v?? t??n"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'T??n ?????y ????? kh??ng ???????c ????? tr???ng!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="H??? v?? t??n" />
                                </Form.Item>
                                <Form.Item
                                    className='w-1/2'
                                    label="S??? ??i???n tho???i"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'S??? ??i???n tho???i c?? ????? d??i l?? 10 s???!',
                                            len: 10,
                                        },
                                    ]}
                                >
                                    <Input type="number" placeholder="S??? ??i???n tho???i" />
                                </Form.Item>
                            </div>
                            <div className='flex space-x-4'>

                                <Form.Item
                                    className='w-1/2'
                                    name="city"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'th??nh ph??? kh??ng ???????c ????? tr???ng!',
                                        },
                                    ]}
                                >
                                    <Select defaultValue="" value={selectedAddress?.codename || ""} onChange={handleSelectAddress}>
                                        <Option value="">-Ch???n Th??nh Ph???-</Option>
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
                                            message: 'Qu???n/huy???n kh??ng ???????c ????? tr???ng!',
                                        },
                                    ]}
                                >
                                    <Select value={selectDistrict?.codename || ""} disabled={selectedAddress?.codename && districtVN?.length !== 0 ? false : true}
                                        defaultValue="" onChange={handleSelectDistrict}>
                                        <Option value="">-Ch???n Qu???n-</Option>
                                        {districtVN === null && <Option value="">-Ch???n Qu???n-</Option>}
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
                                            message: 'Ph?????ng/x?? kh??ng ???????c ????? tr???ng!',
                                        },
                                    ]}
                                >
                                    <Select value={selectWards?.codename || ""} disabled={selectedAddress?.codename && selectDistrict?.codename && wardsVN?.length !== 0 ? false : true}
                                        defaultValue="" onChange={handleSelectWards}>
                                        <Option value="">-Ch???n Ph?????ng-</Option>
                                        {wardsVN === null && <Option value="">-Ch???n Ph?????ng-</Option>}
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
                                            message: 's???, ???????ng kh??ng ???????c ????? tr???ng!',
                                        },
                                    ]}
                                >

                                    <Input
                                        onBlur={getShippingFee}
                                        disabled={selectedAddress?.codename && selectDistrict?.codename && selectWards?.codename ? false : true}
                                        placeholder="S??? nh??, ???????ng" />

                                </Form.Item>
                            </div>
                        </Form>
                        <Divider />
                        <div className='flex justify-between'>
                            <div className='text-base font-medium' >Ph????ng th???c thanh to??n</div>
                            <div>
                                <Radio.Group value={method} onChange={(e) => setMethod(e.target.value)}>
                                    <Radio optionType="button" value="cod">Thanh to??n khi nh???n h??ng</Radio>
                                    <Radio optionType="button" value="momo">V?? momo</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                        <Divider />
                        <div className='flex justify-between'>
                            <div className='text-sm'>T???ng s???n ph???m</div>
                            <div className='text-sm'>{numberFormat(total)}??</div>
                        </div>
                        <div className='flex justify-between'>
                            <div className='text-sm' >Ti???n ship</div>
                            <div className='text-sm'>{shipping ? `${numberFormat(shipping)}??` : 'Vui l??ng nh???p ????? th??ng tin'}</div>
                        </div>
                        <div className='flex justify-between'>
                            <div className='text-sm' >????n v??? v???n chuy???n</div>
                            <div className='text-sm'>{carrier ? carrier : 'Vui l??ng nh???p ????? th??ng tin'}</div>
                        </div>
                        <div className='flex justify-between'>
                            <div className='text-sm' >Th???i gian d??? ki???n</div>
                            <div className='text-sm'>{!timeline ? 'Vui l??ng nh???p ????? th??ng tin' : timeline.includes('ng??y') ? timeline : '1 ng??y'}</div>
                        </div>
                        <Divider />
                        <div className='flex justify-between my-5'>
                            <div className=' '>T???ng</div>
                            <div className='font-semibold text-xl'>{numberFormat(total + shipping)}??</div>
                        </div>
                        <Form.Item
                            className="text-center"
                        >
                            <Button disabled={!shipping}
                                type="primary" onClick={() => {
                                    if (total + shipping >= 30000000 && method === "momo") {
                                        message.info({ content: "S??? ti???n qu?? l???n kh??ng th??? thanh to??n qua Momo", key })
                                        setMethod('cod');
                                    } else {
                                        form.submit()
                                    }
                                }} style={{ width: "100%" }}>
                                X??c nh???n</Button>
                        </Form.Item>
                    </div>

                </div>}

                {status === 'done' && <div className="flex bg-white rounded-lg hover:shadow-xl m-8 w-11/12">
                    <Result className='w-full my-20'
                        status="success"
                        title="B???n ???? mua h??ng th??nh c??ng"
                        subTitle="H??? th???ng s??? g???i h??a ????n v??o gmail trong v??i ph??t"
                        extra={[
                            <Button onClick={() => router.push('/')} type="primary" key="console">
                                Trang ch???
                            </Button>
                        ]}
                    />

                </div>}
            </div>


        </DefaultLayout>
    )
}