import React, { useState,useEffect } from 'react'
import { Tag, Table, Typography,Button,Spin,Input, message,Space,Popconfirm} from "antd";
import {DeleteOutlined ,PlusCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;
import classNames from 'classnames';
const { Search } = Input;

import apiService from '../../../../utils/api/apiService';
import AddMouse from './addMouse';


export default function Mouses() {
    const [mouses, setMouses] = useState([]);
    const [isModalAdd, setIsModalAdd] = useState(false);
//get laptop
    const getMouses= async () => {
        try {
            const response = await apiService.get('/mouses');
            setMouses(response.data);
           
        } catch (error) {
            console.log(error);
        }
      }
    //modal add
    const showModalAdd= () => {
        setIsModalAdd(true);
      };
      
      const handleCancelAdd  = () => {
        setIsModalAdd(false);
      };
      //
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
      useEffect(() => {
        getMouses();
   
      }, [])
      const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'image_detail',
            key: 'image_detail',
            render: img => <div className="flex items-center">
                <img width={120} src={img} alt="ảnh sản phẩm" />
            </div>,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'model',
            key: 'model',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Nút',
            dataIndex: 'button',
            key: 'button',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Màu',
            dataIndex: 'color',
            key: 'color',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Switch',
            dataIndex: 'switch',
            key: 'switch',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Cân nặng',
            dataIndex: 'weight',
            key: 'weight',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Led',
            dataIndex: 'led',
            key: 'led',
            render: (text) => <a>{text}</a>,
        },
     
        {
            title: 'Chiều dài dây',
            dataIndex: 'length',
            key: 'length',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Software',
            dataIndex: 'software',
            key: 'software',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Cổng truyền',
            dataIndex: 'communication',
            key: 'communication',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Dpi',
            dataIndex: 'dpi',
            key: 'dpi',
            render: (text) => <a>{text}</a>,
        },
  
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <>
                 {status==="true" && <Tag color={'green' } >
                       Hoạt động
                    </Tag>}
                    {status==="false" && <Tag color={'volcano' } >
                    Tạm ngừng
                    </Tag>}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                   
                    { record.status==="true" && <Popconfirm
                        title={ `link "${record.link}" sẽ không hiển thị cho người dùng. Tạm dừng hoạt động?`}
                        onConfirm={() => updateProductStatus(record, record.status ="false")}
                        okText={'Tạm dừng'}
                        cancelText="Hủy"
                    >
                        <a className={classNames('hover:text-red-400')}>Tạm dừng</a>
                    </Popconfirm>
                      }
                       { record.status==="false" && <Popconfirm
                        title={ ` "${record.link}" sẽ được mở cửa?`}
                        onConfirm={() => updateProductStatus(record, record.status ="true")}
                        okText={'Hoạt động'}
                        cancelText="Hủy"
                    >
                        <a className={classNames('hover:text-green-400')}>Hoạt động</a>
                    </Popconfirm>
                      }
                 
                </Space>
            ),
                    },
            {
              title: '',
              key: 'delete',
              render: (text, record) => (
                  <Space size="middle">
                     
                    <Popconfirm
                          title={ `link "${record.link}" bạn chắc muốn xóa?`}
                          onConfirm={() => deleteProduct(record)}
                          okText={'Xóa'}
                          cancelText="Hủy"
                      >
                         <DeleteOutlined style={{color:"red"}} />
                      </Popconfirm>
                   
                   
                  </Space>
              ),
        }
      ];
    return(
        <div className=" bg-white rounded-lg hover:shadow-xl p-6 flex flex-col justify-center relative">
        <div className="text-center">
  
        <Title level={3} className="p-5" >Sản phẩm chuột</Title>
        </div>
        <div className='flex justify-between'>
        <Search  placeholder="Tìm kiếm theo tên" style={{ width: 'auto' }} />
        <Button type="primary"  onClick={showModalAdd}  style={{width:"130px", marginBottom:"20px",}} >
          Thêm sản phẩm
        </Button>
        </div>
       
    <AddMouse onFinishFailed={onFinishFailed} isModalAdd={isModalAdd} handleCancelAdd={handleCancelAdd}   />
    <Table
    onRow={(record, rowIndex) => {
      return {
          onClick: () => {
            // setShowModalEdit(true)
            // setProductDetail(record)
          }
      }
  }
  }
  
                  columns={columns} dataSource={mouses}
                  pagination={{ defaultPageSize: 6 }}
                  scroll={{ y: 500 }} />
    {/* <EditProduct deleteImage={deleteImage} handleChangeImage={handleChangeImage} showModalEdit={showModalEdit} setShowModalEdit={setShowModalEdit} productDetail={productDetail} updateProducts={updateProducts} categories={categories} brands={brands}/> */}
  
          </div>
    )
}