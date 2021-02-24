import '../styles/global.scss';
import Layout from '../components/layout';
import React, {useEffect,useState, useRef} from 'react';
// import Router from 'next/router';
import { useRouter } from 'next/router'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; //styles of nprogress
import {UserContext,ShopContext} from '../lib/contextapi';
import {isLogged} from '../lib/userapicontroller';
import { GeistProvider, CssBaseline } from '@geist-ui/react'
import { shopstatus } from '../lib/shopapicontroller';

const Loading = () =>{
  return (
    <div className="page-loading">
      {/* <Spin tip="Loading" size="large"/> */}
    </div>
  )
}

function MyApp({ Component, pageProps }) {
  const [loading,setLoading] = useState(false)
  const router = useRouter()
  NProgress.configure({ showSpinner: true });
  const [user,setUser] = useState({logged: false,location: '',info: {email: null,adminlevel: null,photo: null,shopname: null,name: null,shopid: null,subbed: true}})
  const [shop,setShop] = useState({id: null,open: null,delivery: null,takeaway: null,loading: false,url: null})
  const checkUser = async () => {
    if (localStorage.getItem('logged') === "true" && user.logged === false || localStorage.getItem('logged') === null){
      const response = await isLogged();
      if (response.data.status.code === 200)
      {
        setUser({...user,info: response.data.data,logged: true})
        const myshop = await shopstatus(response.data.data.shop_id);
        if (myshop.status === 200)
          setShop(myshop.data)
        localStorage.setItem('logged', true)
      }
      else{
        localStorage.setItem('logged', false)
      }
    }
  }

  useEffect( async() => {
    // check user
    if (localStorage.getItem('logged') === 'true')
      await checkUser();
    router.events.on('routeChangeStart', () => {
      setLoading(true);
      NProgress.start();
    });
    router.events.on('routeChangeComplete', () => {
      NProgress.done();
      setLoading(false);
    });
    return () => {
      router.events.on('routeChangeError', () => {
        NProgress.done();
        setLoading(false);
      });
    }
  }, [[],router.route])

  return (
    <GeistProvider>
    <CssBaseline />
    <UserContext.Provider value={[user,setUser]}>
    <ShopContext.Provider value={[shop,setShop]}>
    {loading && <Loading/>}
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </ShopContext.Provider>
    </UserContext.Provider>
  </GeistProvider>
  )
}

export default MyApp
