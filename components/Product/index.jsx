import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layouts/Default';
import { HeartOutlined, BorderOutlined, ShoppingCartOutlined, FilterOutlined } from '@ant-design/icons';
import { List, Input, Button, Typography, Pagination, Tooltip, Select } from "antd";
import { useRouter } from 'next/router';
import apiService from '../../utils/api/apiService';
import numberFormat from '../../utils/modules/numberFormat';
import CardProduct from '../UI/CardProduct';
import removeUnicode from '../../utils/modules/removeUnicode';
const { Text, Link, Title } = Typography;
const { Option, OptGroup } = Select;

export default function ProductList() {
    const router = useRouter();
    const [type, setType] = useState({});
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [filter, setFilter] = useState('all');

    function handleChange(value) {
        setFilter(value)
    }

    const getAllProduct = async () => {
        try {
            if (type.brand_id) {
                const response = await apiService.get(`/products/all-type?brand_id=${type.brand_id}&type_id=${type.type_id}`)
                setList(response.data);
            } else {
                const response = await apiService.get(`/products/all?type_id=${type.type_id}`)
                setList(response.data);
            }
        } catch (error) {

        }
    }

    const getProductByFilter = async () => {
        try {
            if (type.brand_id) {
                const response = await apiService.get(`/products/sort?type=${filter}&value=desc&brand_id=${type.brand_id}&type_id=${type.type_id}`)
                setList(response.data);
            } else {
                const response = await apiService.get(`/products/sort?type=${filter}&value=desc&type_id=${type.type_id}`)
                setList(response.data);
            }
        } catch (error) {

        }
    }

    const sortProductByPrice = async () => {
        const [key, sort] = filter.split('_');
        try {
            if (type.brand_id) {
                const response = await apiService.get(`/products/sort?type=${key}_now&value=${sort}&brand_id=${type.brand_id}&type_id=${type.type_id}`)
                setList(response.data);
            } else {
                const response = await apiService.get(`/products/sort?type=${key}_now&value=${sort}&type_id=${type.type_id}`)
                setList(response.data);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        setFilter('all')
        setType(router.query)
    }, [router.query])

    useEffect(() => {
        if (type.type_id) {
            if (filter === 'all') {
                getAllProduct()
            } else if (filter.includes('price')) {
                sortProductByPrice()
            } else {
                getProductByFilter()
            }
        }
    }, [type, filter])

    useEffect(() => {
        if (search) {
            setResult(list.filter(item => removeUnicode(item.name).toLowerCase().includes(removeUnicode(search).toLowerCase())));
        } else {
            setResult(list)
        }
    }, [list, search])
    return (
        <DefaultLayout>
            <div className="p-2 m-8 bg-white rounded-lg">
                <div className="px-4 pt-4">
                    <div className="flex justify-between text-center text-xl font-normal " >
                        <Title level={3}>Danh sách {type.name} {type.brand_id && `${type.brand_name}`}</Title>
                    </div>
                    <div className="text-center">
                        <Input.Search placeholder="Tìm theo tên sản phẩm..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 400 }} />
                        <div className="mt-4 flex justify-center space-x-2">
                            <Button onClick={() => setFilter('all')} danger={filter === 'all'}>Tất cả</Button>
                            <Button onClick={() => setFilter('realease_date')} danger={filter === 'realease_date'}>Mới nhất</Button>
                            <Button onClick={() => setFilter('amount_sale')} danger={filter === 'amount_sale'}>Bán chạy</Button>
                            <Select status={filter.includes('price') ? 'error' : ''} defaultValue="all" value={['all', 'price_asc', 'price_desc'].includes(filter) ? filter : 'all'} style={{ width: 200 }} onChange={handleChange}>
                                <Option value="all">---Lọc giá---</Option>
                                <OptGroup label="Giá">
                                    <Option value="price_asc">Giá: Thấp đến Cao</Option>
                                    <Option value="price_desc">Giá: Cao đến Thấp</Option>
                                </OptGroup>
                            </Select>
                        </div>
                    </div>

                </div>

                <List className="mx-8 my-6"
                    grid={{
                        gutter: 16,
                        column: 4,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 2,
                        xl: 4,
                        xxl: 4,
                    }}
                    pagination={{
                        pageSize: 8,
                        position: 'bottom',
                    }}
                    dataSource={result}
                    renderItem={item => (
                        <List.Item className="my-6">
                            <CardProduct item={item} typeName={type.name} />
                        </List.Item>
                    )}
                />
            </div>
        </DefaultLayout>
    )
}
