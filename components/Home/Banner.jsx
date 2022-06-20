import React, { useState, useEffect } from 'react'
import { Carousel, Button } from "antd";
import Router from 'next/router';

import apiService from '../../utils/api/apiService';
import { userState } from '../../store/userState';

export default function HomeBanner() {

    const [banners, setBanners] = useState([]);
    const getBanners = async () => {
        try {
            const response = await apiService.get('/banners/true');
            setBanners(response.data);
            console.log(banners);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getBanners();
        console.log(banners);
    }, [])

    const contentStyle = {
        height: '360px',
        color: '#fff',
        lineHeight: '300px',
        textAlign: 'center',
        background: '',
    };

    return (
        <div>
            <Carousel autoplay dots="false"  >
                {banners.map(banner => {
                    return (
                        <div>
                            <div
                                className="bg-no-repeat bg-cover bg-center cursor-pointer"
                                style={{
                                    width: 'auto',
                                    height: 700,
                                    backgroundImage: `url(${banner.url})`,
                                }}
                            ></div>

                        </div>
                    )
                })}
            </Carousel>
        </div>
    );
}