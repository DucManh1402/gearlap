import Head from 'next/head'
import Laptop from '../../components/Laptop'

export default function HomePage() {
    return (
        <>
            <Head>
                <title>Laptop</title>
            </Head>

            <Laptop />
        </>
    )
}