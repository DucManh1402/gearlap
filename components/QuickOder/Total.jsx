import React, { useState, useEffect } from 'react'
import { Divider, Table, Input, Button, Radio, InputNumber, Space, Popconfirm } from "antd";
import { CloseOutlined, ShoppingCartOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import numberFormat from '../../utils/modules/numberFormat';
import { useRecoilState } from 'recoil';
import { orderState } from '../../store/orderState';

export default function Total({ products }) {

    const [orders, setOrders] = useRecoilState(orderState);
    const total = orders.reduce((acc, curItem) => {
        return acc + curItem.soluong * curItem.price_now
    }, 0)
    const SHIPPING_FEE = 30000;
    const key = "fetching";

    const onChangeQuantity = (record, value) => {
        const index = orders.findIndex(item => item.product_id === record.product_id);
        const ordersArray = [...orders];
        ordersArray[index] = { ...record, soluong: value };
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
            render: (value, record) => <InputNumber min={1} defaultValue={value}
                value={value} onChange={(newValue) => onChangeQuantity(record, newValue)} />,
        },
        {
            title: '',
            key: 'delete',
            render: (text, record) => (
                <Space size="middle">

                    <Popconfirm
                        title={`link "${record.link}" bạn chắc muốn xóa?`}
                        // onConfirm={() => deleteBanner(record)}
                        okText={'Xóa'}
                        cancelText="Hủy"
                    >
                        <CloseOutlined style={{ color: "red" }} />
                    </Popconfirm>


                </Space>
            ),
        }

    ];
    return (
        <>
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
                scroll={{ y: 300 }}
            />
            <Divider />
            <div className='flex justify-between my-5'>
                <div className='text-base font-medium' >Phương thức thanh toán</div>
                <Radio optionType="button" checked>Thanh toán khi nhận hàng</Radio>
            </div>
            <Divider />
            <Divider />
            <div className='flex justify-between'>
                <div className='text-sm'>Tổng sản phẩm</div>
                <div className='text-sm'>{numberFormat(total)}đ</div>
            </div>
            <div className='flex justify-between'>
                <div className='text-sm' >Tiền ship</div>
                <div className='text-sm'>{numberFormat(SHIPPING_FEE)}đ</div>
            </div>
            <Divider />
            <div className='flex justify-between my-5'>
                <div className=' '>Tổng</div>
                <div className='font-semibold text-xl'>{numberFormat(total + SHIPPING_FEE)}đ</div>
            </div>
        </>
    )

}