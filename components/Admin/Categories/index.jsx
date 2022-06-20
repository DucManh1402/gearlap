import React, { useState, useEffect } from 'react'
import { Tag, Table, Typography, Button, Spin, Input, message, Space, Popconfirm } from "antd";
const { Title } = Typography;
const { Search } = Input;

import { useRecoilState } from 'recoil';
import { categoryState } from '../../../store/categoryState';

export default function CategoryManagement() {
    const [categories, setCategories] = useRecoilState(categoryState);

    //get laptop

    const columns = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <>
                    {status === "true" && <Tag color={'green'} >
                        Hoạt động
                    </Tag>}
                    {status === "flase" && <Tag color={'volcano'} >
                        Tạm ngừng
                    </Tag>}
                </>
            ),
        },
        {
            title: 'Hãng',
            dataIndex: 'brand',
            key: 'brand',
            render: (brand) => {
                return brand.map((item, index) => {
                    return <span>{item.name}{index === brand.length - 1 ? '' : ','} </span>
                })
            },
        },
    ];
    return (
        <div className=" bg-white rounded-lg hover:shadow-xl p-6 flex flex-col justify-center relative">
            <div className="text-center">

                <Title level={3} className="p-5" >Danh mục</Title>
            </div>

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

                columns={columns} dataSource={categories}
                pagination={{ defaultPageSize: 6 }}
                scroll={{ y: 500 }} />

        </div>
    )
}