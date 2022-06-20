import Head from 'next/head'
import ProductList from '../../components/Product'

export default function HomePage() {
    return (
        <>
            <Head>
                <title>Danh sách sản phẩm</title>
            </Head>

            <ProductList />
        </>
    )
}