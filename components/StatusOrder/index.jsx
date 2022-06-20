import React, { useState, useEffect } from 'react'
import { message, Tabs } from "antd";
import { ShoppingCartOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DefaultLayout from '../../layouts/Default';
import ListOrder from './ListOrder';
import ListProductOrder from './ListProductOrder';
import apiService from '../../utils/api/apiService';

const { TabPane } = Tabs;

export default function StatusOder() {
  const [status, setStatus] = useState('waiting');
  const [history, setHistory] = useState([]);
  function callback(key) {
    setStatus(key)
  }

  const key = 'fetching';

  const cancelOrder = async (id) => {
    try {
      await apiService.post(`/orders/update?order_id=${id}`, {
        status: 'cancel'
      })
      message.success({ content: 'Hủy đơn thành công', key })
      getHistory();
    } catch (error) {
      message.success({ content: error.response.data.message, key })

    }
  }


  const getHistory = async () => {
    try {
      setHistory([])
      const response = await apiService.get(`/orders/user?type=${status}`);
      setHistory(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getHistory()
  }, [status])
  return (
    <DefaultLayout>
      <div className=" bg-white rounded-lg hover:shadow-xl m-8 w-11/12 p-6">
        <Tabs centered onChange={callback} type="card" efaultActiveKey="waiting" >
          <TabPane tab="Chờ xác nhận" key="waiting">
            <ListOrder getHistory={getHistory} cancelOrder={cancelOrder} history={history} tab={status} />
          </TabPane>
          <TabPane tab="Đang giao" key="delivery">
            <ListOrder getHistory={getHistory} cancelOrder={cancelOrder} history={history} tab={status} />
          </TabPane>
          <TabPane tab="Đã thanh toán" key="payment">
            <ListOrder getHistory={getHistory} cancelOrder={cancelOrder} history={history} tab={status} />
          </TabPane>
          <TabPane tab="Chưa đánh giá" key="un-feedback">
            <ListProductOrder getHistory={getHistory} history={history} tab={status} />
          </TabPane>
          <TabPane tab="Đánh giá" key="feedback">
            <ListProductOrder getHistory={getHistory} history={history} tab={status} />
          </TabPane>
          <TabPane tab="Đã hủy" key="cancel">
            <ListOrder getHistory={getHistory} cancelOrder={cancelOrder} history={history} tab={status} />
          </TabPane>
        </Tabs>
      </div>
    </DefaultLayout>
  )
}
