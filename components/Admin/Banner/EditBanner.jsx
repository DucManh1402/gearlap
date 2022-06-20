import React, { useState,useEffect } from 'react'
import { Tag, Table, Typography,Button, message,Space,Popconfirm} from "antd";
import {DeleteOutlined  } from "@ant-design/icons";
const { Title } = Typography;
import classNames from 'classnames';

import { storage } from '../../../utils/firebase';
import * as firebase from "firebase/app";
import {ref,   uploadBytes,refFromURL,
    getDownloadURL,deleteObject,
   } from 'firebase/storage';

import AddItem from './addItem';
import EditItem from './editItem';

import apiService from '../../../utils/api/apiService';
import { userState } from '../../../store/userState';
import axios from 'axios';
import { Snapshot } from 'recoil';



export default function EditBanner() {

  const [banners, setBanners] = useState([]);
  const [bannerDetail, setBannerDetail] = useState([]);
  const [image, setImage] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [isModalAddItem, setIsModalAddItem] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const key = "fetching";

  //lấy dữ liệu ảnh
 const handleChangeImage = ({ file }) =>{
  setImageUrl([]);
  setImage([]);
   setImage(file.originFileObj);
   sendPic();
   console.log(image);
  
 }

 const deleteImage = () =>{
  if(image) {
  const uploadTask = ref(storage,`image/${image.name}`);
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
 const sendPic =  () => {
  if(image) {
    const uploadTask = ref(storage,`image/${image.name}`);
    uploadBytes(uploadTask,image).then((snapshot)=>{
      getDownloadURL(snapshot.ref).then((url)=>{
   
        setImageUrl(url);
        console.log(imageUrl);
      })
    })
  }
};

//form thêm 
const handleaddBanner = async (values) => {
  try {
    if(imageUrl){
      message.loading({ content: "Đang thêm nền banner mới", key })
      const response = await apiService.post('/banners', {...values, url:imageUrl});
      getBanners();
      setIsModalAddItem(false);
      message.success({ content: "thêm thành công", key })
    }else{
      message.error({ content: "Chưa có ảnh", key })
    }
  } catch (error) {
      message.error({ content: error.response.data.message, key })
  }

};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

//modal thêm item
const showModalAddItem = () => {
  setIsModalAddItem(true);
};

const handleCancelAddItem = () => {
  setIsModalAddItem(false);
};

//lấy dữ liệu banner
const getBanners = async () => {
  try {
      const response = await apiService.get('/banners');
      setBanners(response.data);
      console.log(banners);
  } catch (error) {
      console.log(error);
  }
}
//thay đổi status của banner
const updateBannerStatus = (record, status) => {
  updateBannerstatus(record.banner_id, { ...record, status })
}
const updateBannerstatus = async (id, values) => {
  try {
   
      message.loading({ content: "Đang cập nhật", key });
      await apiService.post(`/banners/update?banner_id=${id}`, values);
      getBanners();
      message.success({ content: "Cập nhật thành công", key });
       setShowModalEdit(false);
 
  } catch (error) {
      message.error({ content: "Có lỗi xảy ra", key });
  }
}
//thay đổi banner
const updateBanners = async (id, values) => {
  try {
      if(imageUrl==[]){
        setImageUrl( values.url);
      }
      message.loading({ content: "Đang cập nhật", key })
      await apiService.post(`/banners/update?banner_id=${id}`, {...values, url:imageUrl});
      getBanners();
      message.success({ content: "Cập nhật thành công", key });
       setShowModalEdit(false);
 
  } catch (error) {
      message.error({ content: "Có lỗi xảy ra", key });
  }
}
//xóa banner
const deleteBanner = async (record) => {
  try {
      message.loading({ content: "Đang xóa ", key })
      await apiService.get(`/banners/delete?banner_id=${record.banner_id}`);
      getBanners();
      message.success({ content: "Cập nhật thành công", key });
       setShowModalEdit(false);
  } catch (error) {
      message.error({ content: "Có lỗi xảy ra", key });
  }
}


const columns = [
  {
      title: 'Ảnh',
      dataIndex: 'url',
      key: 'url',
      render: img => <div className="flex items-center">
          <img width={120} src={img} alt="ảnh banner" />
      </div>,
  },
  {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      render: (text, record) => <a className="cursor-pointer hover:underline"
      onClick={() => {
        setShowModalEdit(true)
        setBannerDetail(record)
      }}
  >
      {text}</a>,

  },
  
  {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: status => (
          <>
              {/* <Tag color={status==="true"? 'green' :  'volcano'} >
                  {status==="true" ? "Hoạt động" : "Tạm ngừng"}
              </Tag> */}
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
              {/* <a>Invite {record.name}</a> */}
              {/* <Popconfirm
                  title={record.status==="true" ? `link "${record.link}" sẽ không hiển thị cho người dùng. Tạm dừng hoạt động?`
                      : ` "${record.link}" sẽ được mở cửa?`}
                  onConfirm={() => updateBannerStatus(record, record.status ="fasle")}
                  okText={record.status==="true" ? 'Tạm dừng' : "Hoạt động"}
                  cancelText="Hủy"
              >
                  <a className={classNames('', {
                      "hover:text-red-400": record.status==="true",
                      "hover:text-green-400": record.status==="fasle"
                  })}>{record.status==="true" ? 'Tạm dừng' : "Hoạt động"}</a>
              </Popconfirm> */}
              { record.status==="true" && <Popconfirm
                  title={ `link "${record.link}" sẽ không hiển thị cho người dùng. Tạm dừng hoạt động?`}
                  onConfirm={() => updateBannerStatus(record, record.status ="false")}
                  okText={'Tạm dừng'}
                  cancelText="Hủy"
              >
                  <a className={classNames('hover:text-red-400')}>Tạm dừng</a>
              </Popconfirm>
                }
                 { record.status==="false" && <Popconfirm
                  title={ ` "${record.link}" sẽ được mở cửa?`}
                  onConfirm={() => updateBannerStatus(record, record.status ="true")}
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
                    onConfirm={() => deleteBanner(record)}
                    okText={'Xóa'}
                    cancelText="Hủy"
                >
                   <DeleteOutlined style={{color:"red"}} />
                </Popconfirm>
             
             
            </Space>
        ),
  }
];

useEffect(() => {
  getBanners();
  console.log(banners);
}, [])


  
    return(
      <div className=" bg-white rounded-lg hover:shadow-xl p-6 flex flex-col justify-center relative">
      <div className="text-center">

      <Title level={3} className="p-3" >Chỉnh sửa banner</Title>
      </div>
      <Button type="primary" onClick={showModalAddItem} style={{width:"200px", marginBottom:"20px",}}>
        Thêm nền banner
      </Button>
  <AddItem deleteImage={deleteImage} handleChangeImage={handleChangeImage} sendPic={sendPic} onFinishFailed={onFinishFailed} isModalAddItem={isModalAddItem} handleCancelAddItem={handleCancelAddItem} handleaddBanner={handleaddBanner} />
  <Table
                columns={columns} dataSource={banners}
                pagination={{ defaultPageSize: 6 }}
                scroll={{ y: 500 }} />
  <EditItem deleteImage={deleteImage} handleChangeImage={handleChangeImage} showModalEdit={showModalEdit} setShowModalEdit={setShowModalEdit} bannerDetail={bannerDetail} updateBanners={updateBanners} />

        </div>
        
    )
}