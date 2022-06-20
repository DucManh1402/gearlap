import React, { useState, useEffect } from 'react'
import { List, Button, Popover, Rate, Input, message } from 'antd';
import numberFormat from '../../utils/modules/numberFormat';
import moment from 'moment';
import apiService from '../../utils/api/apiService';

const { TextArea } = Input;

function FeedBackForm({ order_id, product_id, getHistory }) {
  const [star, setStar] = useState(0);
  const [content, setContent] = useState('');
  const key = 'fetching';
  const handleFeedback = async () => {

    const feedback = { order_id, product_id, star, content };
    try {
      const response = await apiService.post('/feedbacks', feedback);
      message.success({ content: response.data.message, key });
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

export default function ListProductOrder({ history, tab, getHistory }) {

  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={history}
        pagination={{
          pageSize: 3,
          position: 'bottom',
        }}
        renderItem={item => (
          <List.Item
            extra={
              <>
                {
                  <div className='flex flex-col justify-between bg-gray-100 h-full p-6 space-y-2'>

                    {tab === 'feedback' && <div className='text-red-700 font-medium text-base mb-4'>Đã đánh giá {item.created_at && moment(item.created_at).format('DD/MM/YYYY - HH:mm')}</div>
                    }

                    <div className='text-base'>Số lượng đã mua: {item.quantity}</div>
                    <div className='text-base font-medium'> Tổng tiền: {numberFormat(item.total)} đồng</div>

                    {item.feedback_id && <>
                      <div className='flex space-x-4'>
                        <p className='mt-2'>Số sao:</p>
                        <Rate value={item.star} disabled />
                      </div>
                      <div className='flex space-x-4'>
                        <p>Đánh giá sản phẩm:</p>
                        <p>{item.content}</p>
                      </div>
                    </>}
                    {!item.feedback_id &&
                      <Popover placement="top"
                        content={<FeedBackForm getHistory={getHistory} order_id={item.order_id}
                          product_id={item.product_id} />} trigger={"click"}>
                        <Button className='w-full justify-end'>Đánh giá</Button>
                      </Popover>}
                  </div>
                }
              </>
            }


          >
            <List.Item.Meta
              title={<a className='text-xl break-words'>{`Mã đơn: ${item.order_id.split('-').at(-1)} - ${item.name_product}`}</a>}
              description={
                <div className='flex flex-col space-y-4'>
                  <img
                    width={200}
                    alt="logo"
                    src={item.image}
                  />
                </div>

              }
            />

          </List.Item>
        )}

      />

    </>
  )
}