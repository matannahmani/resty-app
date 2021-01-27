import { Layout, Menu, Breadcrumb, PageHeader } from 'antd';
import {
  HomeOutlined,
  LoginOutlined,
  ShopOutlined,
  LogoutOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import {IoFastFoodOutline} from 'react-icons/io5'
import {RiCoupon2Line} from 'react-icons/ri'
import React,{ useContext, useState,useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import { UserContext } from '../lib/contextapi';
import {logout} from '../lib/userapicontroller';
import { set } from 'nprogress';

const PageLayout = (props) => {
    const { Header, Content, Sider,Footer } = Layout;
    const [collapsed,setCollapse] = useState(true);
    const { SubMenu } = Menu;
    const [user,setUser] = useContext(UserContext);
    const router = useRouter()
    const [loc,setLoc] = useState('/');
    const collapseHandler = () => {
          setCollapse(!collapsed);
    };

    const logoutHandle = async () =>{
      const response = await logout();
      router.push('/logout');
      setUser({login: false,location: '',info: {email: null,adminlevel: null,shopid: null,subbed: true}})
    }

    useEffect(() => {
      if (router.route.replace('/','') === '')
        setLoc('home')
      else
        setLoc(router.route.replace('/',''))
      },[router.route])

    return (
    <Layout className={props.className} style={{ minHeight: '100vh' }}>
    <Head>
     <title>Resty</title>
    </Head>
        <Sider collapsible collapsed={collapsed} onCollapse={collapseHandler}>
          <div className="logo" />
          <Menu theme="dark" selectedKeys={[loc]} mode="inline">
            <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link href="/">
              Home
            </Link>
            </Menu.Item>
            {user.info.subbed &&
            <SubMenu key="shop" icon={<ShopOutlined />} title="My Shop">
              <Menu.Item key="shop/orders"><IoFastFoodOutline className="anticon" />
              <Link href="/shop/orders">
              Orders
              </Link>
              </Menu.Item>
              
              <Menu.Item key="shop/products"><AppstoreOutlined className="anticon" />
              <Link href="/shop/products">
              Products
              </Link>
              </Menu.Item>
              <Menu.Item key="shop/coupons"><RiCoupon2Line className="anticon" />
              <Link href="/shop/coupons">
              Coupouns
              </Link>
              </Menu.Item>
            </SubMenu>
            }
            <Menu.Item key="login" onClick={user.login ? logoutHandle : null} icon={!user.login ? <LoginOutlined /> : <LogoutOutlined />}>
            <Link href={!user.login ? '/login' : '/logout'}>
              {!user.login ? 'Login' : 'Logout'}
            </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Link href="/">
                    <Breadcrumb.Item >Resty</Breadcrumb.Item>
                </Link>
                {loc.split('/').map((item) =>  {
                  if (item !== 'shop')
                  return(
                    <Link href={item === 'home' ? '/' : item}>
                    <Breadcrumb.Item key={item} >{item}</Breadcrumb.Item>
                    </Link>
                )})}
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <PageHeader
                className="site-page-header"
                onBack={() => router.back}
                title={loc !== 'shop' ? loc.replace('/',' ') : loc.replace('/', ' ' )}
                />
                {props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Resty ©2021 Created by Matan Nahmani</Footer>
        </Layout>
      </Layout>
    )
}
export default PageLayout;
