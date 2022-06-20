import React, { useState, useEffect } from 'react'
import { List, Button, Tooltip, Divider, Popconfirm } from 'antd';
import ModalDetailOrder from './ModalDetailOrder';
import numberFormat from '../../utils/modules/numberFormat';
import moment from 'moment';

export default function ListOrder({ getHistory, history, tab, cancelOrder }) {
  const [modalDetail, setModalDetail] = useState(false);

  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={history}
        pagination={{
          pageSize: 8,
          position: 'bottom',
      }}
        renderItem={item => (
          <List.Item
            extra={
              <div className='flex flex-col justify-between bg-gray-100 h-full p-8 space-y-2'>
                {tab == 'cho-xac-nhan' && <div className='text-red-700 font-medium text-base mb-4'>Chờ xác nhận</div>}
                {tab == 'dang-giao' && <div className='text-red-700 font-medium text-base mb-4'>Vận chuyển</div>}

                {tab == 'da-huy' && <div className='text-red-700 font-medium text-base mb-4'>Đã hủy</div>}
                <div className='text-red-700 font-medium text-base mb-4'>Thông tin đơn hàng</div>
                <div className='text-base'> Tổng tiền sản phẩm: {numberFormat(item.subtotal)} đồng</div>
                <div className='text-base'> Phương thức thanh toán: {item.method}</div>
                <div className='text-base'> Phí giao hàng: {numberFormat(item.transport_fee)} đồng</div>
                <Divider className='my-4' />
                <div className='text-base font-medium'> Tổng tiền: {numberFormat(item.total)} đồng</div>
                {tab == 'waiting' &&

                  <Popconfirm
                    title={`Chắc chắn hủy?`}
                    onConfirm={() => cancelOrder(item.order_id)}
                    okText={'Hủy'}
                    cancelText="Quay lại"
                  ><Button
                    className='text-red-700 w-auto justify-end'>Hủy đơn hàng</Button>
                  </Popconfirm>}
                {tab == 'delivery' && <Tooltip title="Liên hệ chúng tôi để hủy đơn" placement="bottom">
                  <Button disabled className='text-red-700 w-auto justify-end'>Hủy đơn hàng</Button>
                </Tooltip>}
              </div>
            }
          >
            <List.Item.Meta
              title={<a className='text-xl' onClick={() => setModalDetail({ ...item, tab })}>Đơn hàng: {item.order_id.split('-').at(-1)} - Thời gian: {moment(item[`waiting_time`]).format('DD/MM/YYYY HH:mm')}</a>}
              description={
                <div className='flex flex-col space-y-4'>
                  <img
                    width={250}
                    alt="logo"
                    src="https://firebasestorage.googleapis.com/v0/b/image-gearlap-upload-596f7.appspot.com/o/image%2FGL.gif?alt=media&token=54c7035f-7e8b-4768-b440-9e525f315a60"
                  />

                  <Button onClick={() => setModalDetail({ ...item, tab })} className='w-full h-10 text-white bg-green-400 font-medium text-base'>Xem chi tiết đơn hàng</Button>
                </div>

              }
            />

          </List.Item>
        )}

      />
      {modalDetail && <ModalDetailOrder modalDetail={modalDetail} setModalDetail={setModalDetail} getHistory={getHistory} />}
    </>
  )
}
