import {Table,Text,Button,Grid,Card,useToasts,Modal,Spacer,Input,Pagination, Select} from '@geist-ui/react';
import {useEffect, useState} from 'react';
import {ChevronLeft,ChevronRight, Users} from '@geist-ui/react-icons'
import React from 'react';
import { ShopContext } from '../../lib/contextapi';
import Router from 'next/router';
import { apideleteUser, apigetUsers, apipatchUser, apipostUser } from '../../lib/userapicontroller';
import { getAllShops } from '../../lib/shopapicontroller';
  const allUsers = () => {
    const operation = (actions, rowData) => {
        return <Button size="mini" shadow auto onClick={(e) => handler(rowData,actions)}>Show User</Button>
    }
    const userlevel = (actions, rowData) => {
        switch (rowData.rowValue.adminlevel) {
            case 1:
                return <Text>Admin</Text>
            case 0:
                return <Text>Casher</Text>
            case 2:
                return <Text>Resty Admin</Text>
        }
    }

    const [shop,setShop] = React.useContext(ShopContext);
    const [state, setState] = useState(false)
    const [pcount, setpcount] = useState(1);
    const [, setToast] = useToasts();
    const [site, setSite] = useState({edit: false});
    const [data,setData] = useState([]);
    const [allshops,setAll] = useState([]);
    const resucemsg = () => {
        setShop({...shop,loading: true})
        setToast({type: 'error',text: `something went wrong!`})
        Router.replace('/')
    }

    const handlePage = (prop) => {
        if (prop === '+')
        {
            if (data[pcount + 5] !== undefined)
                setpcount(pcount+1);
        }
        else if(prop === '-'){
            if (pcount !== 1)
                setpcount(pcount-1);
        }
        else{
            if (data[prop * 3] !== null)
            setpcount(prop)
        }
    }
 
    useEffect(async () =>{
        setShop({...shop,loading: true})
        const data = await apigetUsers();
        if (data.status === 200 && data.data !== null){
        const allshops = await getAllShops();
        setAll(allshops.data.data)
        let datalist = []
        data.data.forEach (item => {
            datalist.push({...item, operation,userlevel})
        });
        setData(datalist);
        setShop({...shop,loading: false});
        }
        else if (data.code === 500){
            resucemsg();
        }        
        setShop({...shop,loading: false})
    },[]);
    const handler = (e,actions) => {
        setSite({...e.rowValue,newuser: false,edit: false,remove: actions.remove,update: actions.update});
        setState(true);
    }
    const closeHandler = (event) => {
        setState(false)
    }

    const removeHandler = async () => {
        const index = data.findIndex(e => e.name === site.name)
        const result = await apideleteUser(site.id);
        if (result.status === 200){
            setToast({type: 'warning',text: `${site.name} was removed`})
            const updatedata = [...data];
            updatedata.splice(index,1);
            setData([...updatedata]);
        }
        else {
            setToast({type: 'error',text: `ERROR`})
        }
        setState(false);
    }

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const checkPassword = (str) => {
        const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(str);
    }
    const saveHandler = async () =>{
        if (site.edit)
        {
            if (site.name.length > 2 && validateEmail(site.email) && site.phone.length > 5
            && (site.password === undefined || checkPassword(site.password)) && site.shop_id !== undefined && site.shop_id !== null)
            {
                let result;
                if (site.edit && !site.newuser)
                {
                    const userdata = {user: {name: site.name}}
                    result = await apipatchUser(userdata,site.id);
                }
                else{
                    const userdata = {user: {name: site.name,email: site.email, adminlevel: site.adminlevel, phone: site.phone, password: site.password,shop_id: site.shop_id}}
                    result = await apipostUser(userdata);
                }
                if (result.data.status === 200){
                    setToast({type: 'success',text: `${site.name} was ${site.newuser ? 'Created' : 'updated'}`})
                    const updatedata = [...data]
                    if (!site.newuser)
                        {
                            const index = data.findIndex(e => e.id === site.id)
                            updatedata[index] = {...site,url: result.data.data.data.attributes.url}
                        }
                        else
                        {
                            updatedata.push(site);
                        }
                    setData([...updatedata]);
                    setSite({...site,edit: false,newuser: false})
                }
                else {
                    setToast({type: 'error',text: `ERROR`})
                }
            }
            else{
                setToast({type: 'warning', text: "User info invaild"})
            }
                
        }
        else {
            setState(false);
        }
    }
    const newUser = () => {
        setSite({name: '', phone: '', password: '', email: '', shopname: '', edit: true,newuser: true, operation,userlevel})
        setState(true);
    }
    const findShopName = (id) => {
        return allshops.find(e => e.id === id).name
    }
      return (
          <>
        <Grid.Container alignItems={"center"} justify={"center"}>
        <Grid xs alignItems={"center"} justify={"center"}>
        <Card style={{overflow: 'auto'}}type="violet" shadow>
            <Text h1 size="24px" className="align-center">Users Control Panel</Text>
        <Table hover={false} className="table-white" data={pcount === 1 ? data.slice(0,5) : data.slice((pcount-1) *5,pcount * 5)}>
          <Table.Column prop="shopname" label="Resturant Name" />
          <Table.Column prop="email" label="User Email" />
          <Table.Column prop="userlevel" label="User Level" />
          <Table.Column prop="operation" label="operation" />
        </Table>
        <Spacer/>
        <Grid.Container justify="flex-end" alignItems="center">
            <Grid xs>
            <Pagination page={pcount} onChange={(e) => handlePage(e)} count={Math.floor(data.length / 5) + 1}>
            <Pagination.Next onClick={(e) => handlePage('+')}><ChevronRight /></Pagination.Next>
            <Pagination.Previous onClick={(e) => handlePage('-')}><ChevronLeft /></Pagination.Previous>
            </Pagination>
            </Grid>
            <Grid>
                <Button size="mini" shadow auto icon={<Users/>} onClick={newUser}>new User</Button>
            </Grid>
        </Grid.Container>
        </Card>
        </Grid>
        </Grid.Container>
        <Modal open={state} onClose={closeHandler}>
        <Modal.Title>User</Modal.Title>
        <Modal.Content>
        <div className="align-center">
            <Text>User Info</Text>
            <Input onChange={(e) => setSite({...site,email: e.target.value})} label="email" disabled={!site.edit} initialValue={site.email !== undefined ? site.email : undefined} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="Email"/>
            <Spacer/>
            <Input onChange={(e) => setSite({...site,phone: e.target.value})} label="phone" disabled={!site.edit} initialValue={site.phone !== undefined ? site.phone : undefined} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="Phone"/>
            <Spacer/>
            <Input onChange={(e) => setSite({...site,name: e.target.value})} label="name" disabled={!site.edit} initialValue={site.name !== undefined ? site.name : undefined} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="User Name"/>
            <Spacer/>
            <Input.Password onChange={(e) => setSite({...site,password: e.target.value})} label="password" disabled={!site.edit} initialValue={site.password !== undefined ? site.password : undefined} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="User Password"/>
            <Spacer/>
            <Select placeholder="Account level" onChange={(e) => setSite({...site,adminlevel: parseInt(e)})} disabled={!site.edit} value={site.adminlevel !== undefined ? site.adminlevel.toString() : null}>
                <Select.Option value="0">Casher</Select.Option>
                <Select.Option value="1">Resturant Owner</Select.Option>
                <Select.Option value="2">Resty Admin</Select.Option>
            </Select>
            {site.newuser &&
            <div>
            <Spacer/>
            <Select onChange={(e) => setSite({...site,shop_id: parseInt(e),shopname: findShopName(parseInt(e))})} placeholder="Resturant Name" disabled={!site.edit} value={site.shop_id !== undefined ? site.shop_id.toString() : null}>
                {allshops.map(e => {
                    return (
                        <Select.Option key={e.id} value={e.id.toString()}>{e.name}</Select.Option>
                    )
                })}
            </Select>
            </div>
            }
        </div>
        </Modal.Content>
        <Modal.Action passive onClick={() => setState(() => setSite({...site,edit: !site.edit}))}>{!site.edit ? 'Edit' : 'Cancel'}</Modal.Action>
        <Modal.Action passive onClick={saveHandler}>{!site.edit ? 'Close' : 'Save'}</Modal.Action>
        {!site.edit && !site.newuser &&
        <Modal.Action passive onClick={removeHandler}>Remove</Modal.Action>
        }
        </Modal>
        </>
      )
}

export default allUsers;