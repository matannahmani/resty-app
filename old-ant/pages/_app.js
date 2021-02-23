import '../styles/global.scss';
import 'antd/dist/antd.css';
import Layout from '../components/layout';
import React, {useEffect,useState, useRef} from 'react';
// import Router from 'next/router';
import { useRouter } from 'next/router'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; //styles of nprogress
import { Spin } from 'antd';
import {UserContext} from '../lib/contextapi';
import {isLogged} from '../lib/userapicontroller';

const Loading = () =>{
  return (
    <div className="page-loading">
      <Spin tip="Loading" size="large"/>
    </div>
  )
}

function MyApp({ Component, pageProps }) {
  const [loading,setLoading] = useState(false)
  const router = useRouter()
  NProgress.configure({ showSpinner: true });
  const [user,setUser] = useState({login: false,location: '',info: {email: null,adminlevel: null,shopid: null,subbed: true}})

  const checkUser = async () => {
    if (localStorage.getItem('logged') === "true" && user.login === false){
      const response = await isLogged();
      if (response.status === 200)
      {
        setUser({...user,...response.data,login: true})
        localStorage.setItem('logged', true)
      }
      else{
        localStorage.setItem('logged', false)
      }
    }
  }

  useEffect( async() => {
    // check user
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
  }, [router.route])
  return (
    <>
    <UserContext.Provider value={[user,setUser]}>
    {loading && <Loading/>}
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </UserContext.Provider>
    </>
  )
}

export default MyApp
