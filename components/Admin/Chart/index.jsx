import { Card, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { Line } from '@ant-design/plots';

import { categoryState } from '../../../store/categoryState'
import apiService from '../../../utils/api/apiService';
import numberFormat from '../../../utils/modules/numberFormat';

const { Option } = Select
export default function ChartAdmin() {
    const categories = useRecoilValue(categoryState);
    const [typeAmount, setTypeAmount] = useState('all');
    const [dataAmount, setDataAmount] = useState([]);
    const [dataProfit, setDataProfit] = useState([]);

    const getAmountChart = async (type) => {
        try {
            setDataAmount([]);
            if (type === 'all') {
                const response = await apiService.get('/charts?type=quantity');
                setDataAmount(response.data);
            } else {
                const response = await apiService.get(`/charts/detail?type_id=${type}`);
                setDataAmount(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getProfit = async () => {
        try {
            setDataProfit([]);

            const response = await apiService.get('/charts?type=subtotal');
            setDataProfit(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    const configAmountChart = {
        data: dataAmount,
        xField: 'Date',
        yField: 'scales',
        seriesField: 'name_product',
        xAxis: {
            type: 'time',
        },
    };

    const configProfitChart = {
        data: dataProfit,
        xField: 'Date',
        yField: 'scales',
        seriesField: 'name_product',
        xAxis: {
            type: 'time',
        },
        yAxis: {
            label: {
                // 数值格式化为千分位
                formatter: (v) => `${numberFormat(v)}`,
            },
        },
        tooltip: {
            formatter: (datum) => {
                return { name: datum.name_product, value: numberFormat(datum.scales) };
            },
        }
    };

    useEffect(() => {
        getAmountChart(typeAmount);
    }, [typeAmount])

    useEffect(() => {
        getProfit();
    }, [])
    return (
        <div>
            <Card type="inner" title="Thống kê số lượng hàng bán"

                extra={<Select value={typeAmount} onChange={(value) => setTypeAmount(value)} placeholder="Chọn loại thống kê" style={{ width: 250 }}>
                    <Option value="all">Toàn bộ sản phẩm</Option>
                    {
                        categories.map(item => {
                            return (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            )
                        })
                    }
                </Select>}>
                <Line {...configAmountChart} loading={dataAmount.length === 0} />
            </Card>

            <Card type="inner" title="Thống kê doanh thu">
                <Line {...configProfitChart} loading={dataProfit.length === 0} />
            </Card>
        </div>
    )
}
