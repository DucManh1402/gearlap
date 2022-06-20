import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Carousel, Button, Spin, message } from "antd";
const { Title, Link } = Typography;
import { FireOutlined, BorderOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import DefaultLayout from "../../../layouts/Default";
import classNames from "classnames";

import apiService from "../../../utils/api/apiService";
import Body1Detail from "./Body1";
import Description from "./Description";
import Evaluate from "./Evaluate";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { orderState } from "../../../store/orderState";

export default function LaptopDetail() {
    const [banners, setBanners] = useState([]);
    const [tab, setTab] = useState("thongtin");
    const [product, setProduct] = useState({});
    const [description, setDescription] = useState({});
    const [feedbacks, setFeedbacks] = useState({});
    const [orders, setOrders] = useRecoilState(orderState)

    const router = useRouter();

    const key = 'fetching';

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

    const getDetailProduct = async (product_id) => {
        try {
            const response = await apiService.get(`/products/detail?product_id=${product_id}`)
            setProduct(response.data);
        } catch (error) {

        }
    }
    const getDescription = async (key, product_id) => {
        try {
            const response = await apiService.get(`/${key}/detail?product_id=${product_id}`)
            setDescription(response.data);
        } catch (error) {

        }
    }

    const getAllFeedback = async (product_id) => {
        try {
            const response = await apiService.get(`/feedbacks?product_id=${product_id}`)
            setFeedbacks(response.data);
        } catch (error) {

        }
    }
    const getBanners = async () => {
        try {
            const response = await apiService.get('/banners/true');
            setBanners(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (router.query.product_id) {
            getDetailProduct(router.query.product_id);
            getDescription(router.query.key, router.query.product_id);
            getAllFeedback(router.query.product_id)
        }
    }, [router.query])
    return (
        <DefaultLayout>
            {product.product_id && <div className="flex flex-col m-6 bg-white
            rounded-lg">
                <Body1Detail addToCart={addToCart} product={product} description={description} />
                <div className="text-center my-4 text-xl font-normal" style={{ fontFamily: "muli,sans-serif" }}>
                    <div className="inline-block  mr-10"
                    >
                        <p
                            className={classNames("cursor-pointer hover:text-blue-500", {
                                "text-xl text-blue-500": tab === "thongtin",
                            })}
                            onClick={() => setTab("thongtin")}
                        >
                            Thông tin
                        </p>
                    </div>
                    <div className="inline-block  mr-10"
                    >
                        <p
                            className={classNames("cursor-pointer hover:text-blue-500", {
                                "text-xl text-blue-500": tab === "mo-ta",
                            })}
                            onClick={() => setTab("mo-ta")}
                        >
                            Thông số kĩ thuật
                        </p>
                    </div>
                    <div className="inline-block "
                    >
                        <p
                            className={classNames("cursor-pointer hover:text-blue-500", {
                                "text-xl text-blue-500": tab === "binh-luan",
                            })}
                            onClick={() => setTab("binh-luan")}
                        >
                            Đánh giá
                        </p>
                    </div>
                </div>
                {tab === "thongtin" && <div className="flex justify-center">
                    <iframe width="50%" height="600"
                        src={product.link?.split('"').find(item => item.includes('docs'))}></iframe>
                </div>}
                {tab === "mo-ta" && <Description description={description} />}
                {tab === "binh-luan" && <Evaluate feedbacks={feedbacks} />}
            </div>}
            {!product.product_id && <div className="flex justify-center items-center h-80 flex-col m-6 bg-white
            rounded-lg ">
                <Spin size="large" />
            </div>}
        </DefaultLayout>

    );
}