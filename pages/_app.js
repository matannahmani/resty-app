import '../styles/global.scss';
import 'antd/dist/antd.css';
import Layout from '../components/layout';
import React, {useEffect,useState, useRef} from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; //styles of nprogress
import { Spin } from 'antd';

const Loading = () =>{
  return (
    <div className="page-loading">
      <Spin tip="Loading" size="large"/>
    </div>
  )
}

function MyApp({ Component, pageProps }) {
  const [loading,setLoading] = useState(false)
  NProgress.configure({ showSpinner: true });
  Router.events.on('routeChangeStart', () => {
    setLoading(true);
    NProgress.start();
  });
  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
    setLoading(false);
  });
  Router.events.on('routeChangeError', () => {
    NProgress.done();
    setLoading(false);
  });
  return (
    <>
    {loading && <Loading/>}
    <Layout  title="Resty" breadcumb={["Resty","home"]}>
      <Component {...pageProps} />
    </Layout>
    </>
  )
}

export default MyApp
