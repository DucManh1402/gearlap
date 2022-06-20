import Head from 'next/head'
import LaptopDetail from '../../../components/Laptop/LaptopDetail'


export default function HomePage() {
    return (
        <>
            <Head>
                <title>Laptop chi tiết</title>
            </Head>

            <LaptopDetail />
        </>
    )
}