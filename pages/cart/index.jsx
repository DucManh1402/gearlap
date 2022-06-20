import Head from 'next/head'
import Favorite from '../../components/Home/FavoriteProduct'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store/userState'
import Cart from '../../components/Cart'

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Giỏ của bạn</title>
            </Head>

            <Cart />
        </>
    )
}