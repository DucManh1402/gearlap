import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Layout, Menu } from 'antd';
import {
    DesktopOutlined,
    GlobalOutlined,
    UserOutlined,
    ScheduleOutlined,
    LineChartOutlined,
    ContainerOutlined,
    HomeOutlined,
    MenuOutlined,
    InboxOutlined
} from '@ant-design/icons';
import Link from 'next/link'
import { useRecoilState } from "recoil";

import { userState } from "../store/userState";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

import EditBanner from '../components/Admin/Banner/EditBanner';
import Products from '../components/Admin/Procduct';
import Laptops from '../components/Admin/Procduct/Laptop';
import Mouses from '../components/Admin/Procduct/Mouse';
import Pads from '../components/Admin/Procduct/Pad';
import Monitors from '../components/Admin/Procduct/Monitor';
import Keyboards from '../components/Admin/Procduct/KeyBoard';
import VGAs from '../components/Admin/Procduct/VGA';
import HDDs from '../components/Admin/Procduct/HDD';
import SSDs from '../components/Admin/Procduct/SSD';
import Order from '../components/Admin/Order';
import ChartAdmin from '../components/Admin/Chart';
import { categoryState } from '../store/categoryState';
import apiService from '../utils/api/apiService';
import CategoryManagement from '../components/Admin/Categories';
export default function AdminLayout() {
    const [user, setUser] = useRecoilState(userState);
    const [tab, setTab] = useState('chart');
    const [collapsed, setCollapsed] = useState(false);
    const [categories, setCategories] = useRecoilState(categoryState);

    const getCategories = async () => {
        try {
            const response = await apiService.get('/categories/');
            setCategories(response.data);
        } catch (error) {
            message.error("Có lỗi lấy danh sách menu xảy ra");
        }
    }

    const onCollapse = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        getCategories();
    }, [])

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <div className="logo" />
                <Menu onClick={({ key: tab }) => setTab(tab)} theme="dark" selectedKeys={tab} mode="inline">
                    <Menu.Item key="chart" icon={<LineChartOutlined />}>
                        Thống kê
                    </Menu.Item>
                    <SubMenu key="order-management" icon={<ContainerOutlined />} title="Quản lý Đơn hàng">
                        <Menu.Item key="order">Danh sách đơn hàng</Menu.Item>
                    </SubMenu>
                    <SubMenu key="banner-management" icon={<HomeOutlined />} title="Quản lý trang chủ">
                        <Menu.Item key="banner">Chỉnh sửa Banner</Menu.Item>
                    </SubMenu>
                    <SubMenu key="categories-management" icon={<MenuOutlined />} title="Quản lý Danh mục">
                        <Menu.Item key="categories">Danh sách danh mục</Menu.Item>
                    </SubMenu>
                    <SubMenu key="products-management" icon={<InboxOutlined />} title="Quản lý sản phẩm">
                        <Menu.Item key="products">Danh sách sản phẩm</Menu.Item>
                        {/* <SubMenu key="laptop-management" title="Quản lý Laptop">
                            <Menu.Item key="laptops">Danh sách laptop</Menu.Item>
                        </SubMenu> */}
                    </SubMenu>


                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="flex justify-between items-center shadow-xl  " style={{ padding: 0 }} >
                    <div className="text-xl ">
                        <Link href="/">
                            <a className="text-yellow-200 hover:text-white ml-4" >GearLap</a>
                        </Link>
                    </div>
                    <div className='text-sm text-white mr-4'>Xin chào, {user.name}</div>
                </Header>
                <Content className="m-6">
                    {tab === 'banner' && <EditBanner />}
                    {tab === 'products' && <Products />}
                    {tab === 'laptops' && <Laptops />}
                    {tab === 'mouses' && <Mouses />}
                    {tab === 'pads' && <Pads />}
                    {tab === 'monitors' && <Monitors />}
                    {tab === 'keyboards' && <Keyboards />}
                    {tab === 'VGAs' && <VGAs />}
                    {tab === 'HDDs' && <HDDs />}
                    {tab === 'SSDs' && <SSDs />}
                    {tab === 'order' && <Order />}
                    {tab === 'chart' && <ChartAdmin />}
                    {tab === 'categories' && <CategoryManagement />}

                </Content>
                <Footer style={{ textAlign: 'center' }}>©Trang quản trị của project GearLap</Footer>
            </Layout>

        </Layout>
    )
}
