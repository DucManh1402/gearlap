import React, { useState, useEffect } from 'react'
import { Tag, Table, Typography, Button, message, Space, Popconfirm, Tabs } from "antd";
import ListOrderAdmin from './ListOrder.jsx';
import apiService from '../../../utils/api/apiService.js';

const { Title } = Typography;
const { TabPane } = Tabs;

export default function Order() {
  const [status, setStatus] = useState('waiting');
  const [history, setHistory] = useState([]);
  const key = 'fetching'
  function callback(key) {
    setStatus(key)
  }

  const changeStatus = async (status, id) => {
    try {
      await apiService.post(`/orders/update?order_id=${id}`, {
        status: status
      })
      message.success({ content: 'Chuyển thành công', key })
      getHistory();
    } catch (error) {
      message.error({ content: error.response.data.message, key })

    }
  }

  const getHistory = async () => {
    try {
      setHistory([]);
      const response = await apiService.get(`/orders?type=${status}`);
      setHistory(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getHistory()
  }, [status])

  return (
    <div className=" bg-white rounded-lg hover:shadow-xl p-6 flex flex-col justify-center relative">
      <div className="text-center">

        <Title level={3} className="p-3" >Quản lí các tình trạng danh sách đơn hàng</Title>
      </div>
      <Tabs centered onChange={callback} type="card" defaultActiveKey="waiting" >
        <TabPane tab="Chờ xác nhận" key="waiting">
          <ListOrderAdmin history={history} changeStatus={changeStatus} tab={'waiting'} />
        </TabPane>

        <TabPane tab="Đang giao" key="delivery">
          <ListOrderAdmin history={history} changeStatus={changeStatus} tab={'delivery'} />
        </TabPane>

        <TabPane tab="Đã thanh toán" key="payment">
          <ListOrderAdmin history={history} changeStatus={changeStatus} tab={'payment'} />
        </TabPane>

        <TabPane tab="Đã hủy" key="cancel">
          <ListOrderAdmin history={history} changeStatus={changeStatus} tab={'cancel'} />
        </TabPane>
      </Tabs>
    </div>
  )
}