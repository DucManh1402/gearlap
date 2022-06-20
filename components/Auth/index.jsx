import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil';
import { userState } from '../../store/userState';
import apiService from '../../utils/api/apiService';

export default function Auth({ children }) {
    const setUser = useSetRecoilState(userState);

    const handleCheckLogined = async () => {
        try {
            const response = await apiService.get('/users/me');
            setUser(response.data);
        } catch (error) {
            setUser({})
        }
    }

    useEffect(() => {
        handleCheckLogined();
    }, [])
    return (
        <>
            {children}
        </>
    )
}
