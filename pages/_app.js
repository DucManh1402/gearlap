import '../styles/loginmedia.css'
import 'antd/dist/antd.css';
import '../styles/index.css'
import { RecoilRoot } from 'recoil';
import Auth from '../components/Auth';

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Auth>
        <Component {...pageProps} />
      </Auth>
    </RecoilRoot>
  )
}

export default MyApp
