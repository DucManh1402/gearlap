import Head from 'next/head'
import FinishPayment from '../../components/FinishPayment'

export default function PaymentDonePage() {
    return (
        <>
            <Head>
                <title>Trang thanh toán</title>
            </Head>

            <FinishPayment />
        </>
    )
}
