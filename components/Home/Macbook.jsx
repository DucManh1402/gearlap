import React from "react";
import { Row, Col, Typography} from "antd";
const { Title , Link } = Typography;
import { FireOutlined, BorderOutlined,ShoppingCartOutlined } from '@ant-design/icons';
export default function Macbook() {

  
  return (
    <div  className="mt-8 bg-black rounded-lg hover:shadow-xl ">
        <Row>
      <Col flex={3}>
      <div className="mx-4 my-8">
      <div className="bg-cover bg-center relative "
                    style={{
                       
                    height: "450px",
                    backgroundImage: `url(https://usegifs.com/wp-content/uploads/2021/08/macbook-pro.gif)`,
                    }}>
                    </div>
       </div>
                 
      </Col>
      <Col flex={2}><div className="mx-4 my-40">
      
      <div className="flex flex-col  text-center my-4">
      <Title level={2} style={{color:"white",}} >MACBOOK</Title>
        <Link href="/">
          <a className="text-xl " >XEM NGAY</a>
        </Link></div>
   
                    </div></Col>
    </Row>
    </div>
  );
}
