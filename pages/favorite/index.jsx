import Head from 'next/head'
import Favorite from '../../components/Home/FavoriteProduct'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store/userState'

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Sản phẩm yêu thích</title>
            </Head>

            <Favorite />
        </>
    )
}