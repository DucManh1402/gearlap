import React, { useEffect, useState } from 'react';
import { List, Card, Button, Typography, Pagination,Tooltip } from "antd";
const { Text, Link, Title } = Typography;
import { HeartOutlined, BorderOutlined,ShoppingCartOutlined ,FilterOutlined } from '@ant-design/icons';
import DefaultLayout from '../../layouts/Default';
import Router from 'next/router';

export default function Laptop() {
    const ListLaptops = [
        {
          title: 'Laptop 1',
          imgLaptop: 'https://cdn.nguyenkimmall.com/images/detailed/775/10050940-laptop-dell-latitude-3420-i5-1135g7-l3420i5ssd-1.jpg',
          giakm: '18,790,000₫',
          giagoc: '21,990,000₫',
          phamtram: '0',
        },
        {
          title: 'Laptop 3',
          imgLaptop: 'https://cdn.nguyenkimmall.com/images/detailed/775/10050940-laptop-dell-latitude-3420-i5-1135g7-l3420i5ssd-1.jpg',
          giakm: '18,790,000₫',
          giagoc: '21,990,000₫',
          phamtram: '15%',
        },
        {
          title: 'Laptop 4',
          imgLaptop: 'https://cdn.nguyenkimmall.com/images/detailed/775/10050940-laptop-dell-latitude-3420-i5-1135g7-l3420i5ssd-1.jpg',
          giakm: '18,790,000₫',
          giagoc: '21,990,000₫',
          phamtram: '0',
        },
        {
          title: 'Laptop 6',
          imgLaptop: 'https://cdn.nguyenkimmall.com/images/detailed/775/10050940-laptop-dell-latitude-3420-i5-1135g7-l3420i5ssd-1.jpg',
          giakm: '18,790,000₫',
          giagoc: '21,990,000₫',
          phamtram: '15%',
        },
        {
          title: 'Laptop Gaming Acer Aspire 7 A715-75G-58U4 GTX 1650 4GB Intel Core i5 10300H 8GB 512GB 15.6 FHD IPS Win 11',
          imgLaptop: 'https://cdn.nguyenkimmall.com/images/detailed/775/10050940-laptop-dell-latitude-3420-i5-1135g7-l3420i5ssd-1.jpg',
          giakm: '18,790,000₫',
          giagoc: '21,990,000₫',
          phamtram: '15%',
        },
        {
          title: 'Laptop Gaming Acer Aspire 7 A715-75G-58U4 GTX 1650 4GB Intel Core i5 10300H 8GB 512GB 15.6 FHD IPS Win 11',
          imgLaptop: 'https://thenewxgear.com/wp-content/uploads/2022/01/58U4-_compressed-600x600.jpg',
          giakm: '18,790,000₫',
          giagoc: '21,990,000₫',
          phamtram: '15%',
        },
        {
          title: 'Laptop 2000',
          imgLaptop: 'https://cdn.nguyenkimmall.com/images/detailed/775/10050940-laptop-dell-latitude-3420-i5-1135g7-l3420i5ssd-1.jpg',
          giakm: '18,790,000₫',
          giagoc: '21,990,000₫',
          phamtram: '15%',
        },

      ];
    
      return (
          <DefaultLayout>
        <div className=" py-2 m-8 bg-white rounded-lg hover:shadow-xl ">
          <div className="flex justify-between text-center  mt-6 mb-8 m-12 text-xl font-normal " >
           
   
            <Title level={3}>LAPTOP </Title>
            <Button type="primary" shape="round" icon={<FilterOutlined />} size='large' />
            
          </div>
    
          <div className="mx-8">
        <List 
          grid={{ gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 4,
            xxl: 4,}}
          dataSource={ListLaptops}
          renderItem={laptop => (
            <List.Item>
              <Card onClick={ () =>Router.push('/laptop/laptop-detail')} title={laptop.title} hoverable style={{width: 320,  borderTop: "none",borderLeft: "none" } }
              >
                <div className="group relative z-40">
                <div
                  className="bg-cover bg-center z-20"
                  style={{
                    height: 270,
                    width:"auto",
                    backgroundImage: `url(${laptop.imgLaptop})`,
                  }}>
                        <div className="  absolute opacity-70  top-0 w-full h-full z-30  group-hover:bg-gray-500 flex justify-center items-center">
                        <Tooltip  title="Thêm vào yêu thích">
                      <div className="text-white cursor-pointer text-xl hover:text-pink-400"
                      
                      ><HeartOutlined style={{ fontSize: 40 }} /></div>
                      </Tooltip>
                    </div>
                </div>
                </div>
                   {laptop.phamtram>'0' && <>
                    <div className="w-auto absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 z-20 ">
                      <div className="relative">
                        <BorderOutlined  
                          style={{ color: "white", background:"red", fontSize: 40 }}
                        />
                        <a className="text-white font-bold text-xs  px-2 transform absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">{laptop.phamtram}</a>
                      </div>
                    </div>
                    
                <div className="flex mt-12 space-x-3">
                  <div className="">
                    <Text  className="font-bold text-lg " >{laptop.giakm}</Text>
                  </div>
                  <div className="flex-1 w-100">
                    <Text  delete>{laptop.giagoc}</Text>
                  </div>
                  <Tooltip  title="Thêm vào giỏ hàng">
                <div className=" right-0 text-gray-400  hover:text-gray-700"
                     
                     ><ShoppingCartOutlined style={{ fontSize: 30 }} /></div>
                     </Tooltip>
                     
               </div>
                   </> 
                    }
                   
                   {laptop.phamtram==0 && <>
                <div className="flex mt-12 space-x-3">
                  <div className="">
                    <Text  className="font-bold text-lg " >{laptop.giagoc}</Text>
                  </div>
                 <div className="w-full"></div>
                 <Tooltip  title="Thêm vào giỏ hàng">
                <div className=" right-0 text-gray-400  hover:text-gray-700"
                     
                     ><ShoppingCartOutlined style={{ fontSize: 30 }} /></div>
                     </Tooltip>
               </div>
                   </> 
                    }


              </Card>
            </List.Item>
          )}
        />
      </div>
        
            <div class="flex justify-center mb-5"><Pagination defaultCurrent={1} total={50} /></div>     

        </div>
        </DefaultLayout>
    
      )
}