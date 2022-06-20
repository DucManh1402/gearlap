import React, { useState, useEffect } from 'react'
import { Tag, Table, Typography, Button, Spin, Input, message, Space, Popconfirm } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;
import classNames from 'classnames';
const { Search } = Input;

import { storage } from '../../../utils/firebase';
import * as firebase from "firebase/app";
import {
  ref, uploadBytes, refFromURL,
  getDownloadURL, deleteObject,
} from 'firebase/storage';

import numberFormat from '../../../utils/modules/numberFormat';
import apiService from '../../../utils/api/apiService';
import AddProduct from './addProduct';
import EditProduct from './editProduct';
import removeUnicode from '../../../utils/modules/removeUnicode';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isModalAddProduct, setIsModalAddProduct] = useState(false);
  const [search, setSearch] = useState('');
  const [result, setResult] = useState([]);
  const [image, setImage] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const key = "fetching";

  const getProducts = async () => {
    try {
      const response = await apiService.get('/products');
      setProducts(response.data);

    } catch (error) {
      console.log(error);
    }
  }
  const getCategories = async () => {
    try {
      if (categories.length === 0) {
        const response = await apiService.get('/categories/');
        setCategories(response.data);
      }
    } catch (error) {
      message.error("Có lỗi lấy danh sách loại xảy ra");
    }
  }
  const getBrands = async () => {
    try {
      if (brands.length === 0) {
        const response = await apiService.get('/utils/brand/');
        setBrands(response.data);
      }
    } catch (error) {
      message.error("Có lỗi lấy danh sách hãng xảy ra");
    }
  }
  //modal add
  const showModalAddProduct = () => {
    setIsModalAddProduct(true);
  };

  const handleCancelAddProduct = () => {
    setIsModalAddProduct(false);
  };
  //form thêm 
  const handleaddProduct = async (values) => {
    try {
      if (imageUrl) {
        message.loading({ content: "Đang thêm nền sản phẩm mới", key })
        await apiService.post('/products', { ...values, image: imageUrl, price_sale: '0' });
        getProducts();
        setIsModalAddProduct(false);
        message.success({ content: "thêm thành công", key })
      } else {
        message.error({ content: "Vui lòng thêm ảnh", key })
      }
    } catch (error) {
      message.error({ content: error.response.data.message, key })
    }

  };
  //lấy dữ liệu ảnh
  const handleChangeImage = ({ file }) => {
    setImageUrl([]);
    setImage([]);
    setImage(file.originFileObj);
    sendPic();
    console.log(image);

  }

  const deleteImage = () => {
    if (image) {
      const uploadTask = ref(storage, `image/${image.name}`);
      deleteObject(uploadTask).then(() => {
        message.success({ content: "xóa thành công", key });
      }).catch((error) => {
        message.error({ content: "xóa thất bại", key });
      });
    }
    setImage([]);
    setImageUrl([]);
  }

  //tải ảnh lên firebase và lấy url ảnh
  const sendPic = () => {
    if (image) {
      const uploadTask = ref(storage, `image/${image.name}`);
      uploadBytes(uploadTask, image).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {

          setImageUrl(url);
          console.log(imageUrl);
        })
      })
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  //thay đổi status 
  const updateProductStatus = (record, status) => {
    updateProductstatus(record.product_id, { ...record, status })
  }
  const updateProductstatus = async (id, values) => {
    try {

      message.loading({ content: "Đang cập nhật", key })
      await apiService.post(`/products/update?product_id=${id}`, { ...values, price_sale: '0' });
      getProducts();
      message.success({ content: "Cập nhật thành công", key });
      setShowModalEdit(false);

    } catch (error) {
      message.error({ content: "Có lỗi xảy ra", key });
    }
  }
  //thay đổi
  const updateProducts = async (id, values) => {
    try {
      if (imageUrl === '') {
        imageUrl = values.image;
      }
      message.loading({ content: "Đang cập nhật", key })
      await apiService.post(`/products/update?product_id=${id}`, { ...values, image: imageUrl, price_sale: '0' });
      getProducts();
      message.success({ content: "Cập nhật thành công", key });
      setShowModalEdit(false);

    } catch (error) {
      message.error({ content: "Có lỗi xảy ra", key });
    }
  }
  //xóa 
  const deleteProduct = async (record) => {
    try {
      message.loading({ content: "Đang xóa ", key })
      await apiService.get(`/products/delete?product_id=${record.product_id}`);
      getProducts();
      message.success({ content: "Cập nhật thành công", key });
      setShowModalEdit(false);
    } catch (error) {
      message.error({ content: "Có lỗi xảy ra", key });
    }
  }

  useEffect(() => {
    getProducts();
    getCategories();
    getBrands();
  }, [])

  useEffect(() => {
    if (search) {
      setResult(products.filter(item => removeUnicode(item.name).toLowerCase().includes(removeUnicode(search).toLowerCase())));
    } else {
      setResult(products)
    }
  }, [products, search])
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: img => <div className="flex items-center">
        <img width={120} src={img} alt="ảnh sản phẩm" />
      </div>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <p
        onClick={() => {
          // setShowModalEdit(true)
          // setProductDetail(record)
        }}
      >
        {text}</p>

      ,
    },
    // {
    //     title: 'Loại ',
    //     dataIndex: 'type_id',
    //     key: 'type_id',
    //     render: (type_id) => <a> {type_id} </a>,
    // },
    // {
    //     title: 'Hãng ',
    //     dataIndex: 'type_id',
    //     key: 'type_id',
    //     render: (type_id) => <a> {type_id} </a>,
    // },

    {
      title: 'Giá gốc',
      dataIndex: 'price',
      key: 'price',
      render: price => <span>{numberFormat(price)} đồng</span>,
    },
    {
      title: 'Giá hiện tại',
      dataIndex: 'price_now',
      key: 'price_now',
      render: price => <span>{numberFormat(price)} đồng</span>,
    },
    {
      title: 'Phần trăm giảm',
      dataIndex: 'percent_sale',
      key: 'percent_sale',
      render: percent_sale => <span>{numberFormat(percent_sale)} %</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
      render: amount => <span>{numberFormat(amount)} cái</span>,
    },
    {
      title: 'Bảo hành',
      dataIndex: 'warranty',
      key: 'warranty',
      render: warranty => <span>{warranty} </span>,
    },

    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: status => (
        <>
          {status === "true" && <Tag color={'green'} >
            Hoạt động
          </Tag>}
          {status === "false" && <Tag color={'volcano'} >
            Tạm ngừng
          </Tag>}
        </>
      ),
    },
  ];


  return (
    <div className=" bg-white rounded-lg hover:shadow-xl p-6 flex flex-col justify-center relative">
      <div className="text-center">

        <Title level={3} className="p-5" >Sản phẩm</Title>
      </div>
      <div className='flex justify-between mb-4'>
        <Search placeholder="Tìm kiếm" onChange={(e) => setSearch(e.target.value)} style={{ width: 'auto' }} />
      </div>

      <AddProduct deleteImage={deleteImage} handleChangeImage={handleChangeImage} sendPic={sendPic} onFinishFailed={onFinishFailed} isModalAddProduct={isModalAddProduct} handleCancelAddProduct={handleCancelAddProduct} handleaddProduct={handleaddProduct} categories={categories} brands={brands} />
      <Table
        columns={columns} dataSource={result}
        pagination={{ defaultPageSize: 6 }}
        scroll={{ y: 500 }} />
      <EditProduct deleteImage={deleteImage} handleChangeImage={handleChangeImage} showModalEdit={showModalEdit} setShowModalEdit={setShowModalEdit} productDetail={productDetail} updateProducts={updateProducts} categories={categories} brands={brands} />

    </div>

  )
}