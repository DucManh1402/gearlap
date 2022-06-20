import React, { useState, useEffect } from 'react'
import { Modal, Table, Divider, Popover, Button, Rate, message } from 'antd';
import numberFormat from '../../utils/modules/numberFormat';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import apiService from '../../utils/api/apiService';

function FeedBackForm({ order_id, product_id, listProduct, setListProduct, getHistory }) {
  const [star, setStar] = useState(0);
  const [content, setContent] = useState('');
  const key = 'fetching';
  const handleFeedback = async () => {

    const feedback = { order_id, product_id, star, content };
    try {
      const response = await apiService.post('/feedbacks', feedback);
      message.success({ content: response.data.message, key });
      const indexProduct = listProduct.findIndex(product => product.product_id === product_id);
      const temp = [...listProduct];
      temp[indexProduct] = { ...temp[indexProduct], feedback_id: 'test' };
      setListProduct(temp);
      getHistory();
    } catch (error) {
      message.error({ content: error.response.data.message, key })
    }

  }

  return <>
    <div className='space-y-4'>
      <div className='flex space-x-4'>
        <p className='mt-2 mr-24'>Điểm:</p>
        <Rate value={star} onChange={(value) => setStar(value)} />
      </div>
      <div className='flex space-x-4'>
        <p className='w-56'>Đánh giá sản phẩm:</p>
        <TextArea rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
    </div>
    <div className='text-right my-2'>
      <Button onClick={handleFeedback} className='text-green-700 w-auto justify-end'>Đánh giá</Button>
    </div>
  </>
}

export default function ModalDetailOrder({ getHistory, modalDetail, setModalDetail, role = 'user' }) {
  const { status } = modalDetail;
  const [listProduct, setListProduct] = useState(modalDetail.listproduct);

  const columns = [
    {
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
      title: 'Đơn giá',
      dataIndex: 'price_now',
      key: 'price_now',
      render: price => <span>{numberFormat(price)} đồng</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value) => <span>{value}</span>,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: price => <span>{numberFormat(price)} đồng</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => {
        if (status !== 'payment' || role === 'admin') return;
        return (
          <Popover placement="top" content={<FeedBackForm getHistory={getHistory} order_id={modalDetail.order_id} setListProduct={setListProduct}
            product_id={record.product_id} listProduct={listProduct} />} trigger={record.feedback_id ? '' : "click"}>
            <Button disabled={record.feedback_id} className='text-red-700 w-auto justify-end'>{record.feedback_id ? 'Đã đánh giá' : 'Đánh giá'}</Button>
          </Popover>
        )
      }
    }
  ];

  return (
    <Modal
      title="Chi tiết đơn hàng"
      centered
      footer={null}
      visible={modalDetail}
      onOk={() => {
        setModalDetail(false)
      }}
      onCancel={() => {
        setModalDetail(false)
      }}
      width={1000}
    >
      <div className='bg-gray-100 p-4'>
        <p className='text-base font-medium'>Thông tin nhận hàng</p>
        <p>Tên: {modalDetail.name}</p>
        <p>Số điện thoại: {modalDetail.phone}</p>
        <p>Địa chỉ: {modalDetail.address}</p>
        <Divider />
        <p className=' '>Mã đơn hàng: {modalDetail.order_id.split('-').at(-1)}</p>
        <p>Thời gian đặt: {moment(modalDetail[`waiting_time`]).format('DD/MM/YYYY - HH:mm')}</p>
        {['delivery', 'payment'].includes(status) && <p>Thời gian giao hàng: {moment(modalDetail[`delivery_time`]).format('DD/MM/YYYY - HH:mm')}</p>}
        {status === 'payment' && <p>Thời gian thanh toán: {moment(modalDetail[`payment_time`]).format('DD/MM/YYYY - HH:mm')}</p>}
        {status === 'cancel' && <p>Thời gian hủy: {moment(modalDetail[`cancel_time`]).format('DD/MM/YYYY - HH:mm')}</p>}

      </div>
      <Table className='my-4'
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
        dataSource={listProduct}
        pagination={false}
        scroll={{ y: 400 }}
      />

      <div className='flex justify-between px-4 py-2 bg-gray-100'>
        <p className='text-lg font-medium'>Tổng tiền:</p>
        <p className='text-lg font-medium'>{numberFormat(modalDetail.total)} đồng</p>
      </div>



    </Modal>
  )
}