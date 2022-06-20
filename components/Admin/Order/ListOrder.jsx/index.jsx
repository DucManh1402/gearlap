import React, { useState, useEffect } from 'react'
import { Table, Button, Tooltip, Space, Popconfirm, Select, message } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import ModalDetailOrder from '../../../StatusOrder/ModalDetailOrder';
import moment from 'moment';
const { Option } = Select;

export default function ListOrderAdmin({ changeStatus, history, tab }) {
    const [modalDetail, setModalDetail] = useState(false);


    const listTab = [
        {
            tab: 'waiting',
            title: 'Chờ xác nhận',
        },
        {
            tab: 'delivery',
            title: 'Đang giao',
        },
        {
            tab: 'payment',
            title: 'Đã thanh toán',
        }
    ]

    const currentTabIndex = listTab.findIndex(item => item.tab === tab);

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'order_id',
            key: 'order_id',
            render: (text, record) => <a onClick={() => setModalDetail({ ...record, tab })}>{text.split('-').at(-1)}</a>,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span>{text}</span>,
        },

        {
            title: 'Mail',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
            render: (_, record) => <span>{moment(record[`${tab}_time`]).format("DD/MM/YY - HH:mm")}</span>,
        },
        {
            title: 'Hành động',
            key: 'delete',
            render: (text, record) => {
                if (['payment', 'cancel'].includes(tab)) return;
                return (
                    <Space size="middle">

                        <Popconfirm
                            title={`Chuyển sang trạng thái "${listTab[currentTabIndex + 1]?.title}"`}
                            onConfirm={() => changeStatus(listTab[currentTabIndex + 1]?.tab, record.order_id)}
                            okText={'Ok'}
                            cancelText="Hủy"
                        >
                            <CheckOutlined style={{ color: "green" }} />
                        </Popconfirm>
                        <Popconfirm
                            title={`Chắc chắn hủy?`}
                            onConfirm={() => changeStatus('cancel', record.order_id)}
                            okText={'Hủy'}
                            cancelText="Quay lại"
                        >
                            <CloseOutlined style={{ color: "red" }} />
                        </Popconfirm>


                    </Space>
                )
            },
        }

    ];

    return (
        <>
            <Table className=''
                onRow={(record, rowIndex) => {
                    return {
                        onClick: () => {
                            // setShowModalEdit(true)
                            // setProductDetail(record)
                        }
                    }
                }
                }
                columns={columns}
                dataSource={history}
                pagination={false}
                scroll={{ y: 500 }}
            />
            {modalDetail && <ModalDetailOrder modalDetail={modalDetail} setModalDetail={setModalDetail} role="admin" />}

        </>
    )
}