import Head from 'next/head'
import Login from '../../components/Login'

export default function HomePage() {
    return (
        <>
            <Head>
                <title>Trang đăng nhập</title>
            </Head>

            <Login />
        </>
    )
}
