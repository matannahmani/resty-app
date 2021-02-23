import {Breadcrumbs,Grid, useMediaQuery,Card} from '@geist-ui/react'
import { Menu } from '@geist-ui/react-icons'
import { useState } from 'react'

const Layout = (props) => {
  const ispc = useMediaQuery('md', { match: 'up' })
  const [menu, setMenu] = useState(true)
  const listenmenu = (e) => {
    if (menu && !e.target.className.includes('sidebar-mobile'))
      setMenu(false)
  }
  return (
    <Grid.Container style={{height: "100vh"}} onClick={(e) => listenmenu(e)}>
      <Grid className={!ispc ? "sidebar sidebar-mobile" : "sidebar"} style={(!ispc && menu) ? {width: '240px'} : {width: '0px'}} md={3} lg={3} xl={2} >

      </Grid>
      <Grid xs direction="column" className="content">
      <Grid>
        {!ispc && (
         <>
         <Menu onClick={() => setMenu(true)}/>
         </> 
        )}
      <Breadcrumbs className="content-breadcrumbs">
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="">Catalog</Breadcrumbs.Item>
        <Breadcrumbs.Item>Page</Breadcrumbs.Item>
      </Breadcrumbs>
      </Grid>
      <Grid>
      <Card shadow>
  <h4>The Evil Rabbit</h4>
  <p>shadow card.</p>
</Card>
        {/* {props.children} */}
      </Grid>
      </Grid>
    </Grid.Container>
  )
}
export default Layout;