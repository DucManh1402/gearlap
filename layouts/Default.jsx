import React, { useEffect, useState } from "react";
import Link from 'next/link'
import Router from 'next/router';
import { Layout, Menu, Input, Button, Breadcrumb, Badge, BackTop, Carousel, Dropdown, message, Tooltip } from "antd";
import { UserOutlined, LaptopOutlined, ShoppingCartOutlined, MenuFoldOutlined, ShoppingOutlined, MenuUnfoldOutlined, SoundOutlined, DesktopOutlined, HeartTwoTone, SettingOutlined } from "@ant-design/icons";
import MessengerCustomerChat from 'react-messenger-customer-chat';
import { useRecoilState, useRecoilValue } from "recoil";
import FooterWeb from "./footer";

import { userState } from "../store/userState";
import apiService from "../utils/api/apiService";
import { categoryState } from "../store/categoryState";
import { orderState } from "../store/orderState";

const { Header, Footer, Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

export default function DefaultLayout({ children }) {

  const [user, setUser] = useRecoilState(userState);
  const [isLogin, setIsLogin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useRecoilState(categoryState);
  const [orders, setOrders] = useRecoilState(orderState);
  const [current, setCurrent] = useState('');
  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (user.user_id) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

  }, [user])

  const handleLogout = async () => {
    try {
      const response = await apiService.get('/auths/logout');
      message.success(response.data.message);
      setUser({})
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  }

  // const handleChangeTab = (tab) => {
  //   switch (tab) {
  //     case 'admin':
  //       Router.push('/admin');
  //       break;

  //     default:
  //       break;
  //   }
  // }

  const handleClick = ({ keyPath }) => {
    const [subPath, mainPath] = keyPath
    const mainProduct = categories.find(item => item.id === mainPath);
    if (subPath.includes('all')) {
      Router.push(`/product?name=${mainProduct.name}&type_id=${mainPath}`)
    } else {
      const brand = mainProduct.brand.find(item => subPath.includes(item.brand_id));

      Router.push(`/product?name=${mainProduct.name}&type_id=${mainPath}&brand_name=${brand.name}&brand_id=${subPath.split('_')[0]}`)
    }
  }

  const handleRedirect = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    Router.push('/userdetail');
  }

  const getCategories = async () => {
    try {
      const response = await apiService.get('/categories/');
      setCategories(response.data);
    } catch (error) {
      message.error("Có lỗi lấy danh sách menu xảy ra");
    }
  }

  const getLoveProducts = async () => {
    try {
      const response = await apiService.get('/love-products');
      console.log(response.data)
    } catch (error) {
      // message.error("Có lỗi xảy ra");
    }
  }
  useEffect(() => {
    getLoveProducts();
    getCategories();
  }, []);

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem('orders'));
    if (storage && storage.length !== 0 && orders.length === 0) {
      setOrders(storage)
    } else if (orders.length !== 0) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders])
  const menu = (
    <Menu inlineCollapsed="false">
      <Menu.Item key="0" disabled>
        <a className="text-black">Xin chào, {user.name} </a>
      </Menu.Item>
      {user?.role === "admin" && <Menu.Item key="admin" onClick={() => Router.push('/admin')} >
        <a>Trang quản trị</a>
      </Menu.Item>}
      <Menu.Item key="1" onClick={() => Router.push('/statusorder')} >
        <a>Xem tình trạng đơn hàng</a>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleRedirect(user)}>
        <a>Sửa thông tin</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={handleLogout}><a>Đăng xuất</a></Menu.Item>
    </Menu>
  );



  const onSearch = value => console.log(value);

  // const contentStyle = {
  //   height: '15px',
  //   color: 'black',
  //   lineHeight: '20px',
  //   textAlign: 'center',
  //   background: 'white',
  // };
  return (
    <Layout className="rounded-xl  md:p-0 ">
      {/* <Carousel autoplay dots="false"  >
        <div>
          <h3 style={contentStyle}
          >GIẢM GIÁ LÊN ĐẾN 30% </h3>
        </div>
        <div>
          <h3 style={contentStyle}
          >SỰ KIỆN 30/4</h3>
        </div>
        <div>
          <h3 style={contentStyle}
          >LAPTOP GAMING MẠNH NHẤT</h3>
        </div>
      </Carousel> */}
      <div className="sticky z-50 top-0">
        <Header style={{ background: "black" }} className="flex justify-between items-center">
          <div className=" flex space-x-6 items-center" >
            <div className="text-xl flex space-x-10 ">
              <Link href="/">
                <a className="text-white text-2xl hover:text-yellow-200" >GearLap</a>
              </Link>
            </div>

          </div>
          <div className="flex space-x-5 items-center justify-items-center" >
            <Tooltip placement="bottom" title="Giỏ hàng">
              <Badge count={orders.length}  size="small" style={{ background: "yellow", color: "black" }}>
                <ShoppingCartOutlined onClick={() => Router.push('/quickorder')} style={{ color: "white", fontSize: 24, cursor: "pointer" }} />
              </Badge>
            </Tooltip>

            {isLogin && <>
              <Tooltip placement="bottom" title="Sản phẩm yêu thích">
                <HeartTwoTone onClick={() => Router.push('/favorite')} twoToneColor="#eb2f96" style={{ fontSize: 24, cursor: "pointer" }} />
              </Tooltip>

              <Dropdown overlay={menu} placement="bottomRight">

                <SettingOutlined onClick={e => e.preventDefault()} style={{ fontSize: 24, color: "white" }} />

              </Dropdown>
            </>}

            {!isLogin && <>
              <Tooltip placement="bottom" title="Đăng nhập">
                <UserOutlined onClick={() => Router.push('/login')} style={{ fontSize: 24, color: "white" }} />
              </Tooltip>
            </>}

          </div>

        </Header>

      </div>

      <Layout>
        <Sider
          theme="light"
          className="site-layout-background"
          collapsible={false} collapsed={collapsed} onCollapse={onCollapse}
        >
          <Menu onClick={handleClick} className="sticky top-16" mode="vertical" theme="light">
            {categories.map((categorie, index) => {
              return (
                <SubMenu
                  key={categorie.id}
                  title={
                    <span>
                      <span>{categorie.name}</span>
                    </span>
                  }
                >
                  <Menu.Item key={`all_${index}`}>Toàn bộ sản phẩm</Menu.Item>
                  <Menu.ItemGroup title="Hãng">
                    {categorie.brand.map(brand => {
                      return <Menu.Item className="capitalize" key={brand.brand_id + `_${index}`}>{brand.name}</Menu.Item>
                    })}
                  </Menu.ItemGroup>
                </SubMenu>
              )
            })}
            {/* {categories.map(categorie => {
              return (
                <Menu.Item className="text-lg"
                  key={categorie.id}
                  onClick={() => {
                    setCurrent(categorie.id)
                    Router.push(`/product?name=${categorie.name}&&type_id=${categorie.id}`)
                  }}>{categorie.name}

                </Menu.Item>
              )
            })} */}

          </Menu>


        </Sider>
        <Layout>
          <Content className="site-layout">

            <div className="bg-gray-100 ">
              <div className=" mx-auto">
                {children}
              </div>

            </div>
          </Content>
          <Footer  >
            <MessengerCustomerChat
              pageId="103729078960869"
              appId="513023080467374"

            />
            <BackTop />

            <FooterWeb />
            <div className="pt-20 text-center">
              ©Trang web của project Movies
            </div>
          </Footer>
        </Layout>


      </Layout>


    </Layout>
  );
}
