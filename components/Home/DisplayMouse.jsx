import React from "react";
import Link from 'next/link'

import { Row, Col, Typography } from "antd";
import { FireOutlined, BorderOutlined, ShoppingCartOutlined } from '@ant-design/icons';
export default function DisplayMouse() {


  return (
    <div className="mt-8 bg-black rounded-lg hover:shadow-xl ">
      <Row  >
        <Col flex={3}>
          <div className="mx-4 my-8">

            <div className="flex flex-col  text-center my-4">
              <Typography.Title level={2} style={{ color: "white", }} >MÀN HÌNH</Typography.Title>
              <Link href="/product?name=Màn%20hình&type_id=a92d6815-53ac-4bac-9900-8ba13436e35c">
                <a className="text-xl" >XEM NGAY</a>
              </Link></div>
            <div className="bg-cover bg-center relative "
              style={{

                height: "360px",
                backgroundImage: `url(https://www.techpowerup.com/img/JyXBNIxpCValWYDi.jpg)`,
              }}>
            </div>
          </div>

        </Col>
        <Col flex={2}><div className="mx-4 my-8">

          <div className="flex flex-col  text-center my-4">
            <Typography.Title level={2} style={{ color: "white", }} >CHUỘT</Typography.Title>
            <Link href="/product?name=Chuột&&type_id=7dd3a2eb-972e-428a-b5b9-d41043462dc3">
              <a className="text-xl " >XEM NGAY</a>
            </Link></div>
          <div className="bg-cover bg-center relative "
            style={{
              height: "360px",
              backgroundImage: `url(https://img.youtube.com/vi/et5J0h6bhJY/sddefault.jpg)`,
            }}>
          </div>
        </div></Col>
      </Row>
    </div>
  );
}
