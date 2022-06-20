import React from 'react'

import DefaultLayout from '../../layouts/Default'
import HomeBanner from './Banner'
import DisplayMouse from './DisplayMouse'
import LaptopList from './LaptopList'
import Sound from './Sound'
import Macbook from './Macbook'

export default function Home() {

    return (
        <DefaultLayout >
            <HomeBanner />
            <div className='m-8'>
                {/* <Macbook/> */}
                <DisplayMouse />
                <LaptopList />
                <Sound />
            </div>
        </DefaultLayout>
    )
}
