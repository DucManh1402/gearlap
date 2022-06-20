import React from "react";
import { Row, Col } from 'antd';
import {
  FacebookOutlined,
  GoogleOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  AndroidOutlined,
  AppleOutlined
} from "@ant-design/icons";

import Link from "next/link";

export default function FooterWeb() {
  return (

    <div>
      <Row justify="space-between">
        <Col span={4}>
          <Link href="/">
            <a className="text-3xl">GearLap</a>
          </Link>
          <p className=" text-base font-normal my-6">
            Sản phẩm thương mại điện tử bán laptop và các phụ kiện đi kèm
          </p>
          <Row justify="start">
            <Link href="/">
              <FacebookOutlined style={{ paddingRight: '8px', fontSize: 36, color: "#3b5999" }} />
            </Link>
            <Link href="/">
              <GoogleOutlined style={{ paddingRight: '8px', fontSize: 36, color: "#cd201f" }} />
            </Link>
            <Link href="/">
              <YoutubeOutlined style={{ paddingRight: '8px', fontSize: 36, color: "#cd201f" }} />
            </Link>
            <Link href="/">
              <TwitterOutlined style={{ fontSize: 36, color: "#55acee" }} />
            </Link>
          </Row>
        </Col>
        <Col span={4}>
          <a className="text-2xl ">Link</a>
          <div className="pt-6 text-base flex flex-col space-y-1 font-normal ">
            <Link href="/">
              <a >FAQ</a>
            </Link>
            <Link href="/">
              <a >Brand Guidelines</a>
            </Link>
            <Link href="/">
              <a >Thỏa thuận sử dụng</a>
            </Link>
            <Link href="/">
              <a >Chính sách bảo mật</a>
            </Link>
          </div>
        </Col>
        <Col span={4}>
          <a className="text-2xl ">Đối tác</a>
          <Row className="pt-6" justify="start">
            <div
              className="bg-cover"
              style={{
                marginRight: '8px',
                width: 50,
                height: 50,
                backgroundImage: `url(https://e7.pngegg.com/pngimages/988/715/png-clipart-laptop-asus-zenfone-%E5%8D%8E%E7%A1%95-logo-laptop-angle-electronics-thumbnail.png)`,
              }}
            ></div>
            <div
              className="bg-cover "
              style={{
                marginRight: '8px',
                width: 50,
                height: 50,
                backgroundImage: `url(https://icon2.cleanpng.com/20180626/eab/kisspng-laptop-acer-aspire-chrome-os-intel-core-i5-asus-5b3264b1517ad6.4915360615300292333338.jpg)`,
              }}
            ></div>
            <div
              className="bg-cover"
              style={{
                marginRight: '8px',
                width: 50,
                height: 50,
                backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgH6bMv7dJh38gEgwndyCpBdYUMh-svaz9WtDH85oTwzpG3f7S5iqbUgkQcnLrBQxoUsE&usqp=CAU)`,
              }}
            ></div>
            <div
              className="bg-cover"
              style={{
                width: 50,
                height: 50,
                backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlRAVnHQZUIeRryoRhLUj-31bTOPuZ4GQrodnqQGpNJlkkj8wZwUEKML6r6n-uR9NboAU&usqp=CAU)`,
              }}
            ></div>
          </Row>

        </Col>
        <Col span={4}>
          <a className="text-2xl ">Mobile App</a>
          <div className="pt-6 space-x-3">
            <AndroidOutlined style={{ fontSize: 36 }} />
            <AppleOutlined style={{ fontSize: 36 }} /></div>
        </Col>
      </Row>
    </div>

  );
}
