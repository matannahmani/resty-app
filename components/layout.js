import {Breadcrumbs,Grid,Card,useClickAway,User} from '@geist-ui/react'
import { Menu, X, LogIn, LogOut, Home, Grid as GridIcon, Truck, ShoppingCart, Power, CreditCard, List, Package } from '@geist-ui/react-icons'
import React,{ useContext, useEffect, useState } from 'react'
import SidebarBTN from './sidebarbtn'
import DelayedRender from './delayrender'
import { UserContext } from '../lib/contextapi'

const Layout = (props) => {
  const [mobile,setMobile] = useState(false)
  const [menu, setMenu] = useState(true)
  const [user, setUser] = useContext(UserContext);
  const ref = React.useRef()
  
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
      <User src="https://unix.bio/assets/avatar.png" name="Matan Nahmani">
        Resty.io
      </User>
      </Grid>
      <Grid alignItems="flex-end" className="sidebar-links">
      {user.login ?
      <>
        <SidebarBTN icon={<LogOut/>} text="Logout"/>
        <SidebarBTN icon={<Home/>} text="Home"/>
        <SidebarBTN icon={<List/>} text="Orders"/>
        <SidebarBTN icon={<Package/>} text="Today Orders"/>
        <SidebarBTN icon={<GridIcon/>} text="Products"/>
        <SidebarBTN icon={<CreditCard/>} text="Coupouns"/>
        <SidebarBTN icon={<Truck/>} text="Close Delivery"/>
        <SidebarBTN icon={<ShoppingCart/>} text="Close Takeaway"/>
        <SidebarBTN icon={<Power/>} text="Close Shop"/>
      </>
        :
        <SidebarBTN icon={<LogIn/>} text="Login"/>
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