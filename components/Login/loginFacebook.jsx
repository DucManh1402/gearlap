import React from 'react';
import FacebookLogin from 'react-facebook-login';
import {  FacebookOutlined } from "@ant-design/icons";

export default function  LoginFB ({handleLoginFB})  {

        return(
            <div>
               <FacebookLogin
                                appId="513023080467374"

                                textButton="Đăng nhập với Facebook"
                                fields="name,email,picture"
                                icon={<FacebookOutlined style={{ marginRight: "8px", fontSize: "20px" }} />}
                                cssClass="btnFacebook"

                                callback={handleLoginFB}
                                size="small"
                            />
            </div>
        )
   
}