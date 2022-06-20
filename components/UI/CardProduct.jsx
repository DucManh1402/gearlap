import { Card, message, Tooltip, Typography } from 'antd'
import React from 'react'
const { Text } = Typography;
import { HeartOutlined, BorderOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import numberFormat from '../../utils/modules/numberFormat';
import removeUnicode from '../../utils/modules/removeUnicode';
import { useRouter } from 'next/router';
import apiService from '../../utils/api/apiService';
import { useRecoilState } from 'recoil';
import { orderState } from '../../store/orderState';

export default function CardProduct({ item, typeName }) {
    const typeToKey = typeName && (removeUnicode(typeName)).toLowerCase().replaceAll(' ', '');
    const router = useRouter();
    const [orders, setOrders] = useRecoilState(orderState)
    const key = "fetching";

    const setLoveProduct = async () => {
        message.loading({ content: "Đang thêm ...", key })
        try {
            const response = await apiService.post('/love-products', { product_id: item.product_id, type_id: item.type_id })
            message.success({ content: "Thêm thành công", key })
        } catch (error) {
            message.error({ content: error.response.data.message, key })
        }
    }

    const addToCart = (item) => {
        if (orders.find(itemOrder => itemOrder.product_id === item.product_id)) {
            message.error({ content: 'Đã thêm giỏ hàng', key })
        } else if (parseInt(item.amount) === 0) {
            message.error({ content: 'Sản phẩm đã hết hàng', key })
        } else {
            setOrders((prev) => [...prev, { ...item, soluong: 1 }])
            message.success({ content: "Thêm thành công", key })
        }
    }

    return (
        <Card title={item.name} hoverable style={{ width: 300 }}
        >
            <div className="group relative z-40">
                <div
                    className="bg-cover bg-center z-20"
                    style={{
                        height: 240,
                        width: "auto",
                        backgroundImage: `url(${item.image})`,
                    }}>
                    <div onClick={() => router.push(`/product/detail?key=${typeToKey}&product_id=${item.product_id}`)}
                        className="absolute opacity-70  top-0 w-full h-full z-30  group-hover:bg-gray-500 flex justify-center items-center">
                        <Tooltip title="Thêm vào yêu thích">
                            <div className="text-white cursor-pointer text-xl hover:text-pink-400"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLoveProduct()
                                }}
                            ><HeartOutlined style={{ fontSize: 40 }} /></div>
                        </Tooltip>
                    </div>
                </div>
            </div>
            {item.percent_sale > '0' && <>
                <div className="w-auto absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 z-20 ">
                    <div className="relative">
                        <BorderOutlined
                            style={{ color: "white", background: "red", fontSize: 40 }}
                        />
                        <a className="text-white font-bold text-xs  px-2 transform absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">{item.percent_sale}%</a>
                    </div>
                </div>

                <div className="flex mt-12 space-x-3">
                    <div className="">
                        <Text className="font-bold text-lg " >{numberFormat(item.price_now)}đ</Text>
                    </div>
                    <div className="flex-1 w-100">
                        <Text delete>{numberFormat(item.price)}đ</Text>
                    </div>
                    <Tooltip title="Thêm vào giỏ hàng">
                        <div className=" right-0 text-gray-400  hover:text-gray-700"
                            onClick={() => {
                                addToCart({ ...item, keyProduct: typeToKey })
                            }}
                        ><ShoppingCartOutlined style={{ fontSize: 18 }} /></div>
                    </Tooltip>

                </div>
            </>
            }

            {item.percent_sale === 0 && <>
                <div className="flex justify-between mt-12 space-x-3">
                    <div className="">
                        <Text className="font-bold text-lg " >{numberFormat(item.price_now)}đ</Text>
                    </div>

                    <Tooltip title="Thêm vào giỏ hàng">
                        <div className=" right-0 text-gray-400  hover:text-gray-700"
                            onClick={() => {
                                addToCart({ ...item, keyProduct: typeToKey })
                            }}
                        ><ShoppingCartOutlined style={{ fontSize: 18 }} /></div>
                    </Tooltip>

                </div>
            </>}

        </Card>
    )
}
