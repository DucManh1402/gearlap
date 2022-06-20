import React, { useState, useEffect } from 'react'
import { Tag, Table, Typography, Tooltip, Spin, Input, message, Space, Popconfirm, Select } from "antd";
import { RestOutlined } from '@ant-design/icons';
import DefaultLayout from '../../../layouts/Default';
const { Title } = Typography;

import numberFormat from '../../../utils/modules/numberFormat';
import apiService from '../../../utils/api/apiService';
import { useRecoilValue } from 'recoil';
import { categoryState } from '../../../store/categoryState';
import { useRouter } from 'next/router';
import removeUnicode from '../../../utils/modules/removeUnicode';
const { Option, OptGroup } = Select;

export default function Favorite() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [filter, setFilter] = useState('');
    const categories = useRecoilValue(categoryState);
    const key = "fetching";

    function handleChange(value) {
        if (value) {
            filterLoveProducts(value)
        } else {
            getLoveProducts();
        }

        setFilter(value);
    }

    const resetProducts = () => {
        if (filter) {
            filterLoveProducts(filter);
        } else {
            getLoveProducts();
        }
    }

    const filterLoveProducts = async (type_id) => {
        try {
            const response = await apiService.get(`/love-products/filter?type_id=${type_id}`);
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const checkTypeToKey = (type_id) => {
        const resultKey = typeName && (removeUnicode(categories.find(item => item.id === type_id)?.name)).toLowerCase().replaceAll(' ', '')
        return resultKey;
    }

    const getLoveProducts = async () => {
        try {
            const response = await apiService.get('/love-products');
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteLoveProducts = async (id) => {
        try {
            const response = await apiService.get(`/love-products/delete?love_id=${id}`);
            resetProducts();
            message.success({ content: "Xóa thành công", key })
        } catch (error) {
            message.error({ content: "Có lỗi xảy ra", key })

        }
    }

    useEffect(() => {
        getLoveProducts();
    }, [])

    useEffect(() => {
        if (search) {
            setResult(products.filter(item => removeUnicode(item.name).toLowerCase().includes(removeUnicode(search).toLowerCase())));
        } else {
            setResult(products)
        }
    }, [products, search])

    const columns = [
        {
            title: 'Ảnh',
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
            render: (text, record) => <a onClick={() => {
                router.push(`/product/detail?key=${checkTypeToKey(record.type_id)}&product_id=${record.product_id}`);
            }}>{text}</a>,
        },


        {
            title: 'Giá gốc',
            dataIndex: 'price',
            key: 'price',
            render: price => <span>{numberFormat(price)} đồng</span>,
        },
        {
            title: 'Giá hiện tại',
            dataIndex: 'price_now',
            key: 'price_now',
            render: price => <span>{numberFormat(price)} đồng</span>,
        },


        {
            title: 'Giảm giá',
            dataIndex: 'percent_sale',
            key: 'percent_sale',
            render: percent_sale => <span className='text-red-500 font-bold'>{percent_sale}%</span>,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <>
                    {status === "true" && <Tag color={'green'} >
                        Còn hàng
                    </Tag>}
                    {status === "false" && <Tag color={'volcano'} >
                        Tạm ngừng
                    </Tag>}
                </>
            ),
        },

        {
            title: '',
            key: 'delete',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Xóa khỏi danh sách yêu thích">
                        <div className=" text-gray-400  hover:text-red-700 cursor-pointer"
                            onClick={() => {
                                deleteLoveProducts(record.love_id);
                            }}
                        ><RestOutlined style={{ fontSize: 22 }} /></div>
                    </Tooltip>


                </Space>
            ),
        }

    ];


    return (
        <DefaultLayout>
            <div className=" bg-white rounded-lg hover:shadow-xl p-6 flex flex-col justify-center relative m-8">
                <div className="text-center">

                    <Title level={3} className="p-5" >Sản phẩm yêu thích</Title>
                </div>

                <div className='flex items-center space-x-4'>
                    <Select className='my-2'
                        defaultValue=""
                        value={filter}
                        // value={['all', 'price_asc', 'price_desc'].includes(filter) ? filter : 'all'} 
                        style={{ width: 200 }}
                        onChange={handleChange}
                    >
                        <Option value={''}>---Chọn loại---</Option>
                        {categories.map(item => <Option value={item.id}>{item.name}</Option>
                        )}

                    </Select>
                    <Input.Search placeholder="Tìm theo tên sản phẩm..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 400 }} />
                </div>


                {/* <AddProduct deleteImage={deleteImage} handleChangeImage={handleChangeImage} sendPic={sendPic} onFinishFailed={onFinishFailed} isModalAddProduct={isModalAddProduct} handleCancelAddProduct={handleCancelAddProduct} handleaddProduct={handleaddProduct} categories={categories} brands={brands} /> */}
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

                    columns={columns} dataSource={result}
                    pagination={false}
                    scroll={{ y: 500 }} />

            </div>
        </DefaultLayout>
    )
}