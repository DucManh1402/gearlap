import Head from 'next/head'
import Router from 'next/router'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import AdminLayout from '../../layouts/AdminLayout'
import { userState } from '../../store/userState'

export default function HomePage() {
    const user = useRecoilValue(userState);
    // useEffect(() => {
    //     if (user) {
    //         if (user.role !== "admin") {
    //             Router.push('/loginadmin');
    //         }
    //     }
    // }, [user])
    return (
        <>
            <Head>
                <title>Trang quản trị GearLap</title>
            </Head>

            <AdminLayout />
        </>
    )
}
