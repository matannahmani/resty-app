import {Breadcrumbs,Grid,useToasts,useClickAway,User} from '@geist-ui/react'
import { Menu, X, LogIn, LogOut, Home, Grid as GridIcon, Truck, ShoppingCart, Power, CreditCard, List, Package, Monitor } from '@geist-ui/react-icons'
import React,{ useContext, useEffect, useState } from 'react'
import SidebarBTN from './sidebarbtn'
import DelayedRender from './delayrender'
import { UserContext, ShopContext } from '../lib/contextapi'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { logout } from '../lib/userapicontroller';
import {switchshop,switchdelivery,switchtakeaway} from '../lib/shopapicontroller';

const Layout = (props) => {
  const [mobile,setMobile] = useState(false)
  const [menu, setMenu] = useState(true)
  const [user, resetUser] = useContext(UserContext);
  const ref = React.useRef()
  const [shop,setShop] = React.useContext(ShopContext);
  const router = useRouter();
  const [,setToasts] = useToasts();
  const errormsg = () => setToasts({type: 'error',text: `ERROR: Please try again later!'`})

  const shopHandler = async () =>{
      const response = await switchshop(user.info.shop_id);
      if (response.status === 200){
          setToasts({type: 'success',text: `Shop is now ${(!shop.open) ? 'open' : 'closed'}`})
          setShop({...shop,open: !shop.open})
      }
      else
          errormsg()
  }
  const deliveryHandler = async () =>{
      // post server get response handle
      const response = await switchdelivery(user.info.shop_id);
      if (response.status === 200){
          setToasts({type: 'success',text: `Delivery is now ${(!shop.delivery) ? 'open' : 'closed'}`})
          setShop({...shop,delivery: !shop.delivery})
      }
      else
          errormsg()
  }
  const takeawayHandler = async () =>{
      // post server get response handle
      const response = await switchtakeaway(user.info.shop_id);
      if (response.status === 200){
          setToasts({type: 'success',text: `Takeaway is now ${(!shop.delivery) ? 'open' : 'closed'}`})
          setShop({...shop,takeaway: !shop.takeaway})
      }
      else
          errormsg()
  }

  const userlogout = async () => {
    await logout();
    location.reload();
  }
  
  useClickAway(ref, (e) => {
    if (menu && mobile)
    setMenu(false)
  })
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        // Set window width/height to state
        if (window.innerWidth < 900)
          setMobile(true)
        else
        {
          setMobile(false)
          setMenu(true)
        }
      }
      // Add event listener
      window.addEventListener("resize", handleResize);
      // Call handler right away so state gets updated with initial window size
      handleResize();
      // Remove event listener on cleanup
    }
  }, [])
  return (
    <Grid.Container style={{height: "100vh"}}>
      <Grid direction="column" alignItems="center" className={mobile ? menu ? "sidebar sidebar-mobile sidebar-mobile-on" : "sidebar sidebar-mobile" : "sidebar"}>
      {/* sidebar content */}
      {menu &&
      <DelayedRender time={400}>
      <div ref={ref} className="sidebar-content">
      <Grid className="sidebar-head">
      <User src={ user.info.photo !== null ? "https://unix.bio/assets/avatar.png" : ''} name={user.info.name !== null ? user.info.name : "Please login"}>
        {user.info.shopname !== null ? user.info.shopname : "Please login"}
      </User>
      </Grid>
      <Grid alignItems="flex-end" className="sidebar-links">
      {user.logged ?
      <>
        <SidebarBTN onClick={userlogout} icon={<LogOut/>} text="Logout"/>
        <Link href="/">
        <SidebarBTN icon={<Home/>} text="Home"/>
        </Link>
        <Link href="/orders">
        <SidebarBTN icon={<List/>} text="Orders"/>
        </Link>
        <Link href="/orderstoday">
        <SidebarBTN icon={<Package/>} text="Today Orders"/>
        </Link>
        <Link href="/products">
        <SidebarBTN icon={<GridIcon/>} text="Products"/>
        </Link>
        <Link href="/coupons">
        <SidebarBTN icon={<CreditCard/>} text="Coupons"/>
        </Link>
        <SidebarBTN icon={<Truck/>} onClick={deliveryHandler} text={`${shop.delivery ? 'Close' : 'Open'} Delivery`}/>
        <SidebarBTN icon={<ShoppingCart/>} onClick={takeawayHandler} text={`${shop.takeaway ? 'Close' : 'Open'} Takeaway`}/>
        <SidebarBTN icon={<Power/>} onClick={shopHandler} text={`${shop.open ? 'Close' : 'Open'} Shop`}/>
        {shop.url !== null &&
        <SidebarBTN icon={<Monitor/>} onClick={ () => window.open(shop.url)} text="To Site"/>
        }
      </>
        :
        <Link href="/login">
        <SidebarBTN icon={<LogIn/>} text="Login"/>
        </Link>
      }

      </Grid>
      {/* mobile sidebar close menu btn */}
      {mobile &&  <div onClick={() => setMenu(false)} className="sidebar-close">{<X/>}</div>}
      </div>
      </DelayedRender>
      }
      </Grid>
      <Grid xs direction="column" className="page-content">
      {/* active menu button for mobile devices */}
      <Grid>
        {mobile && (
         <>
         <Menu onClick={() => setMenu(true)}/>
         </> 
        )}
      <Breadcrumbs color="white" className="content-breadcrumbs">
        <Breadcrumbs.Item>Resty</Breadcrumbs.Item>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
      </Breadcrumbs>
      </Grid>
      <Grid>
        {props.children}
      </Grid>
      </Grid>
    </Grid.Container>
  )
}
export default Layout;