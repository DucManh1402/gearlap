import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { KeyOutlined, HistoryOutlined, HomeOutlined, EditOutlined, FacebookOutlined } from "@ant-design/icons";


export default function Description({ description }) {
  const [detail, setDetail] = useState([])
  useEffect(() => {
    const { status, image_detail, ...rest } = description
    const asArray = Object.entries(rest);
    const filtered = asArray.filter(([key, value]) => {
      if (key.includes('id')) return false;
      return true;
    });
    console.log(filtered);
    setDetail(filtered)
    // const justStrings = Object.fromEntries(filtered);
  }, [description])

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Descriptions
      bordered
      className="mx-20 mb-10"
    >
      {detail.map(([key, value]) =>
        <Descriptions.Item label={(key.replaceAll('_', ' ').toUpperCase())} span={3}>
          {value}
        </Descriptions.Item>
      )}
      {/* <Descriptions.Item label="Model" span={3}>
        Acer Aspire 7 A715 42G
      </Descriptions.Item> */}
      {/* <Descriptions.Item label="Ổ cứng" span={3}>
        256GB PCIe® NVMe™ M.2 SSD
      </Descriptions.Item>
      <Descriptions.Item label="CPU" span={3}>
        AMD Ryzen 5 – 5500U (6 nhân 12 luồng)
      </Descriptions.Item>
      <Descriptions.Item label="RAM" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="Âm thanh" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="VGA" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="Màn hình" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="Cổng truyền" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="Đọc bộ nhớ" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="Lan" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="Wifi" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="bluetooth" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="Web Came" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="Hệ điều hành" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="Pin" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="Cân nặng" span={3}>

      </Descriptions.Item>
      <Descriptions.Item label="Size" span={3}>

      </Descriptions.Item> */}
    </Descriptions>

  );
}