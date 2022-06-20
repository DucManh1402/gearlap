import React, { useState,useEffect } from 'react'
import { Result, Button,Steps } from 'antd';
import DefaultLayout from '../../layouts/Default';
const { Step } = Steps;
import { ShoppingCartOutlined,FileTextOutlined,CheckCircleOutlined   } from '@ant-design/icons';



export default function Success() {
    
    return(
        <DefaultLayout>
            <div className='flex flex-col items-center'>
            <Steps className='mt-7 mx-10 w-1/3' size="small" >
    <Step status="wait" title="Giỏ hàng" icon={<ShoppingCartOutlined/>} />
    <Step status="wait" title="Chi tiết thanh toán"icon={<FileTextOutlined />} />
    <Step status="process" title="Đặt hàng thành công" icon={<CheckCircleOutlined />} />
  </Steps>

  <div className="flex bg-white rounded-lg hover:shadow-xl m-8 w-11/12">
        
  <Result className='w-full my-20'
    status="success"
    title="Bạn đã mua hàng thành công"
    subTitle="Mã đơn hàng: 2017182818828182881 Hệ thống sẽ gửi hóa đơn vào gmail trong vài phút"
    extra={[
      <Button type="primary" key="console">
        Trang chủ
      </Button>,
      <Button key="buy">Mua tiếp</Button>,
    ]}
  />
    
      </div>
            </div>
            
           
          </DefaultLayout>
    )
}