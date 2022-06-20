import Head from 'next/head'
import Favorite from '../../components/Home/FavoriteProduct'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store/userState'
import StatusOder from '../../components/StatusOrder'

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Thông tin mua hàng</title>
            </Head>

            <StatusOder />
        </>
    )
}