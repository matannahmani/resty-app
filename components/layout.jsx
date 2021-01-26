import { Layout, Menu, Breadcrumb } from 'antd';
import {
  HomeOutlined,
  LoginOutlined,
  ShopOutlined,
  LogoutOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import {IoFastFoodOutline} from 'react-icons/io5'
import {RiCoupon2Line} from 'react-icons/ri'
import React,{ useState } from 'react';
import Head from 'next/head'

const PageLayout = (props) => {
    const { Header, Content, Sider,Footer } = Layout;
    const [collapsed,setCollapse] = useState(false);
    const { SubMenu } = Menu;
    const [user,setUser] = useState({login: true,subbed: true})

    const collapseHandler = () => {
          setCollapse(!collapsed);
      };
    return (
    <Layout className={props.className} style={{ minHeight: '100vh' }}>
    <Head>
     <title>{props.title}</title>
    </Head>
        <Sider collapsible collapsed={collapsed} onCollapse={collapseHandler}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<HomeOutlined />}>
              Home
            </Menu.Item>
            {user.subbed &&
            <SubMenu key="sub1" icon={<ShopOutlined />} title="My Shop">
              <Menu.Item key="4"><IoFastFoodOutline className="anticon" />Orders</Menu.Item>
              <Menu.Item key="3"><AppstoreOutlined className="anticon" />Products</Menu.Item>
              <Menu.Item key="5"><RiCoupon2Line className="anticon" />Coupons</Menu.Item>
            </SubMenu>
            }
            <Menu.Item key="2" icon={!user.login ? <LoginOutlined /> : <LogoutOutlined />}>
              {!user.login ? 'Login' : 'Logout'}
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                {props.breadcumb.map((item) => (
                    <Breadcrumb.Item>{item}</Breadcrumb.Item>
                ))}
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                {props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Resty ©2021 Created by Matan Nahmani</Footer>
        </Layout>
      </Layout>
    )
}
export default PageLayout;
