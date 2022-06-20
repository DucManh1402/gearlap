import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import DefaultLayout from '../../layouts/Default'
import { Button, Result, Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import apiService from '../../utils/api/apiService';

const { Step } = Steps;
export default function FinishPayment() {
    const [current, setCurrent] = useState(0);
    const [status, setStatus] = useState('process');
    const [message, setMessage] = useState('')
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            const { orderId, requestId } = router.query;
            (async function () {
                try {
                    await apiService.get(`/payments/momo/query?orderId=${orderId}&requestId=${requestId}`);
                    setCurrent(2);
                    setStatus('finish')
                } catch (error) {
                    setCurrent(1);
                    setStatus('error');
                    setMessage(error.response.data.message);
                }
            }())
        }
    }, [router.isReady])
    return (
        <DefaultLayout>
            <div className='m-2 p-4 bg-white'>
                <Steps current={current} status={status}>
                    <Step title="Thanh toán" icon={current === 0 ? <LoadingOutlined /> : null} />
                    <Step title="Thanh toán thất bại" />
                    <Step title="Thanh toán thành công" />
                </Steps>
                <div>
                    {current === 0 && <Result
                        title="Hệ thống đang xử lý thanh toán"
                        icon={<LoadingOutlined />}
                    />}
                    {current === 1 && <Result
                        status="error"
                        title="Thanh toán thất bại"
                        subTitle={message}
                    />}
                    {current === 2 && <Result
                        status="success"
                        title="Thanh toán thành công"
                        subTitle="Đơn hàng đã được thanh toán."
                    />}
                </div>
            </div>

        </DefaultLayout>
    )
}
