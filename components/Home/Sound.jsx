import React from "react";
import Link from 'next/link'
import { Row, Col, Typography } from "antd";
import { FireOutlined, BorderOutlined, ShoppingCartOutlined } from '@ant-design/icons';
export default function DisplayMouse() {

  // const { Title, Link } = Typography;

  return (
    <div className="mt-8 bg-black rounded-lg hover:shadow-xl ">
      <Row>
        <Col flex={4}>
          <div className="mx-4 my-8">

            <div className="flex flex-col  text-center my-4">
              <Typography.Title level={3} style={{ color: "white", }} >LOA</Typography.Title>
              <Link href="/product?name=Loa&&type_id=99e62d6a-0319-4b1c-824c-0dd25d35bd02">
                <a className="text-xl" >XEM NGAY</a>
              </Link></div>
            <div className="bg-cover bg-center relative "
              style={{

                height: "360px",
                backgroundImage: `url(https://res.cloudinary.com/lautsprecher-teufel/image/upload/c_fill,f_auto,h_650,q_auto,w_1440/v1593675617/kat-stage-primary-flyout-stereo-gaming.jpg)`,
              }}>
            </div>
          </div>

        </Col>
        <Col flex={2}><div className="mx-8 my-8">

          <div className="flex flex-col  text-center my-4">
            <Typography.Title level={2} style={{ color: "white", }} >TAI NGHE</Typography.Title>
            <Link href="/product?name=Tai%20nghe&&type_id=8f48567e-c213-4946-b73f-07c93316bf1f">
              <a className="text-xl" >XEM NGAY</a>
            </Link>
          </div>
          <div className="bg-cover bg-center relative "
            style={{

              height: "360px",
              backgroundImage: `url(https://blog.turtlebeach.com/wp-content/uploads/2020/10/S600-Gen-2-1920x1080-1.png)`,
            }}>
          </div>
        </div></Col>
      </Row>
    </div>
  );
}
