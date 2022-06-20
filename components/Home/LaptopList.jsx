import React, { useEffect, useState } from "react";
import { List, Card, Carousel, Typography, Tooltip } from "antd";
const { Text, Link, Title } = Typography;
import { FireTwoTone, HeartOutlined, BorderOutlined, ShoppingCartOutlined, setTwoToneColor, ThunderboltTwoTone, RightOutlined } from '@ant-design/icons';
import apiService from "../../utils/api/apiService";
import numberFormat from "../../utils/modules/numberFormat";
import { useRecoilValue } from "recoil";
import { categoryState } from "../../store/categoryState";
import CardProduct from "../UI/CardProduct";
export default function LaptopList() {

  setTwoToneColor('red');
  const [listLaptop, setListLaptop] = useState([]);
  const [listSale, setListSale] = useState([]);
  const categories = useRecoilValue(categoryState)
  // const ListLaptops = [
  //   {
  //     title: 'Laptop Gaming Acer Aspire 7 A715-75G-58U4 GTX 1650 4GB Intel Core i5 10300H 8GB 512GB 15.6 FHD IPS Win 11',
  //     imgLaptop: 'https://cdn.nguyenkimmall.com/images/detailed/775/10050940-laptop-dell-latitude-3420-i5-1135g7-l3420i5ssd-1.jpg',
  //     giakm: '18,790,000₫',
  //     giagoc: '21,990,000₫',
  //     phamtram: '0',
  //   },
  //   {
  //     title: 'Laptop Gaming Acer Aspire 7 A715-75G-58U4 GTX 1650 4GB Intel Core i5 10300H 8GB 512GB 15.6 FHD IPS Win 11',
  //     imgLaptop: 'https://thenewxgear.com/wp-content/uploads/2022/01/58U4-_compressed-600x600.jpg',
  //     giakm: '18,790,000₫',
  //     giagoc: '21,990,000₫',
  //     phamtram: '15%',
  //   },
  //   {
  //     title: 'Laptop Gaming Acer Aspire 7 A715-75G-58U4 GTX 1650 4GB Intel Core i5 10300H 8GB 512GB 15.6 FHD IPS Win 11',
  //     imgLaptop: 'https://thenewxgear.com/wp-content/uploads/2022/01/58U4-_compressed-600x600.jpg',
  //     giakm: '18,790,000₫',
  //     giagoc: '21,990,000₫',
  //     phamtram: '15%',
  //   },
  //   {
  //     title: 'Laptop Gaming Acer Aspire 7 A715-75G-58U4 GTX 1650 4GB Intel Core i5 10300H 8GB 512GB 15.6 FHD IPS Win 11',
  //     imgLaptop: 'https://thenewxgear.com/wp-content/uploads/2022/01/58U4-_compressed-600x600.jpg',
  //     giakm: '18,790,000₫',
  //     giagoc: '21,990,000₫',
  //     phamtram: '15%',
  //   },
  // ];

  const getBestSeller = async () => {
    const idLaptop = categories?.find
    const response = await apiService.get('/products/best?type=amount_sale&value=asc&type_id=c58910ab-26d6-4ccd-b8df-5ea5a9980b0c')
    setListLaptop(response.data.result);
  }

  const getBestSale = async () => {
    const response = await apiService.get('/products/best?type=percent_sale')
    setListSale(response.data.result);
  }

  useEffect(() => {
    getBestSeller();
    getBestSale();
  }, [])

  return (

    <>
      <div className="py-2 my-6 bg-white rounded-lg shadow-lg ">
        <div className="flex flex-row text-center space-x-2 mt-6 mb-8 ml-12 text-xl font-normal " >

          <FireTwoTone style={{ color: 'red', fontSize: '32px' }} />
          <Title level={3}>LAPTOP BÁN CHẠY</Title>
        </div>

        <div className="mx-8 my-6">
          <List
            grid={{
              gutter: 16,
              column: 4, xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 4,
              xxl: 4,
            }}
            pagination={{
              pageSize: 4,
              position: 'bottom',
            }}
            dataSource={listLaptop}
            renderItem={laptop => (
              <List.Item>
                <CardProduct item={laptop} typeName={'Laptop'} />
              </List.Item>
            )}
          />
        </div>
      </div>

      <div className="py-2 my-6 bg-white rounded-lg shadow-lg ">
        <div className="flex flex-row text-center space-x-2 mt-6 mb-8 ml-12 text-xl font-normal " >
          <ThunderboltTwoTone style={{ color: 'red', fontSize: '32px' }} />
          <Title level={3}>SIÊU KHUYẾN MÃI</Title>
        </div>

        <div className="mx-8 my-6">
          <List
            grid={{
              gutter: 16,
              column: 4, xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 4,
              xxl: 4,
            }}
            pagination={{
              pageSize: 4,
              position: 'bottom',
            }}
            dataSource={listSale}
            renderItem={item => (
              <List.Item>
                <CardProduct item={item} typeName={categories.find(category => category.id === item.type_id)?.name} />
              </List.Item>
            )}
          />
        </div>
        {/* <div className="text-right mx-4 my-4">
          <Link href="/">
            <a className="text-gray-900 hover:text-blue-500" >Xem thêm...</a>
          </Link></div> */}


      </div>
    </>
  );
}
