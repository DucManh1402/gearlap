import Head from 'next/head'
import { useRecoilValue } from 'recoil'
import AdminLogin from '../../components/Admin/login'
import { userState } from '../../store/userState'

export default function HomePage() {
    const user = useRecoilValue(userState);
   
    return (
        <>
            <Head>
                <title>Trang đăng nhập quản trị GearLap</title>
            </Head>

            <AdminLogin />
        </>
    )
}