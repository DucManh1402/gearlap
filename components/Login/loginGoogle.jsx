import React from 'react';
import { GoogleLogin } from 'react-google-login';

export default function  LoginGG ({handleLoginGG})  {

        return(
            <div>
                <GoogleLogin
                                clientId="1006982726767-iah4u9p4ubsg55viarbe8ike0s6nlquj.apps.googleusercontent.com"

                                onSuccess={handleLoginGG}
                                onFailure={handleLoginGG}

                                cookiePolicy={'single_host_origin'}
                                buttonText="Đăng nhập với Google"
                            />
            </div>
        )
   
}