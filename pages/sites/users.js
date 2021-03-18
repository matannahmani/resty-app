import {Table,Text,Button,Grid,Card,useToasts,Modal,Spacer,Input,Pagination} from '@geist-ui/react';
import {useEffect, useState} from 'react';
import {TiTick,TiCancel} from 'react-icons/ti';
import {ChevronLeft,ChevronRight} from '@geist-ui/react-icons'
import React from 'react';
import {apigetShops,apideleteShop, apipatchShop} from '../../lib/shopapicontroller';
import { ShopContext } from '../../lib/contextapi';
import Router from 'next/router';
import ResturantCatgeory from '../../components/resCategory';
  const allUsers = () => {
    const operation = (actions, rowData) => {
        return <Button size="mini" shadow auto onClick={(e) => handler(rowData,actions)}>Show User</Button>
    }
    const enabled = (actions, rowData) => {
        switch (rowData.rowValue.users[0].adminlevel) {
            case 1:
                return <Text>Admin</Text>
            case 0:
                return <Text>Casher</Text>
            case 2:
                return <Text>Resty Admin</Text>
        }
    }
    const email = (actions, rowData) => {
        return <Text>{rowData.rowValue.users[0].email}</Text>
    }
    const [shop,setShop] = React.useContext(ShopContext);
    const [state, setState] = useState(false)
    const [pcount, setpcount] = useState(1);
    const [, setToast] = useToasts();
    const [site, setSite] = useState({edit: false});
    const [data,setData] = useState([]);
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
        const data = await apigetShops();
        if (data.status === 200 && data.data !== null){
        let datalist = []
        data.data.forEach (item => {
            datalist.push({...item, operation,enabled, email})
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
        setSite({...e.rowValue,edit: false,remove: actions.remove,update: actions.update});
        setState(true);
    }
    const closeHandler = (event) => {
        setState(false)
    }

    const removeHandler = async () => {
        const index = data.findIndex(e => e.name === site.name)
        const result = await apideleteUser(site.users[0]);
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
        const index = data.findIndex(e => e.id === site.id)
        if (site.edit)
        {
            if (site.name.length > 5 && validateEmail(site.users[0].email) && site.users[0].phone.length > 5 && site.users[0].name.length > 2
            && (site.users[0].password === undefined || checkPassword(site.users[0].password)))
            {
                const result = await apipatchShop(site,site.id);
                if (result.data.status === 200){
                    setToast({type: 'success',text: `${site.name} was updated`})
                    const updatedata = [...data]
                    updatedata[index] = {...site,url: result.data.data.data.attributes.url}
                    setData([...updatedata]);
                    setSite({...site,edit: false})
                }
                else {
                    setToast({type: 'error',text: `ERROR`})
                }
            }
            else{
                setToast({type: 'warning', text: "Site info invaild"})
            }
                
        }
        else {
            setState(false);
        }
    }

      return (
          <>
        <Grid.Container alignItems={"center"} justify={"center"}>
        <Grid xs alignItems={"center"} justify={"center"}>
        <Card style={{overflow: 'auto'}}type="violet" shadow>
            <Text h1 size="24px" className="align-center">Users Control Panel</Text>
        <Table hover={false} className="table-white" data={pcount === 1 ? data.slice(0,5) : data.slice((pcount-1) *5,pcount * 5)}>
          <Table.Column prop="name" label="Resturant Name" />
          <Table.Column prop="email" label="User Email" />
          <Table.Column prop="enabled" label="Resturant Open" />
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
        </Grid.Container>
        </Card>
        </Grid>
        </Grid.Container>
        <Modal open={state} onClose={closeHandler}>
        <Modal.Title>User</Modal.Title>
        <Modal.Content>
        <div className="align-center">
            <Text>User Info</Text>
            <Input onChange={(e) => setSite({...site,users: [{...site.users[0],email: e.target.value}]})} label="email" disabled={!site.edit} initialValue={site.users !== undefined ? site.users[0].email : undefined} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="Name"/>
            <Spacer/>
            <Input onChange={(e) => setSite({...site,users: [{...site.users[0],phone: e.target.value}]})} label="phone" disabled={!site.edit} initialValue={site.users !== undefined ? site.users[0].phone : undefined} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="Phone"/>
            <Spacer/>
            <Input onChange={(e) => setSite({...site,users: [{...site.users[0],name: e.target.value}]})} label="name" disabled={!site.edit} initialValue={site.users !== undefined ? site.users[0].name : undefined} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="User Name"/>
            <Spacer/>
            <Input.Password onChange={(e) => setSite({...site,users: [{...site.users[0],password: e.target.value}]})} label="password" disabled={!site.edit} initialValue={site.users !== undefined ? site.users[0].password : undefined} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="User Password"/>
            <Spacer/>
        </div>
        </Modal.Content>
        <Modal.Action passive onClick={() => setState(() => setSite({...site,edit: !site.edit}))}>{!site.edit ? 'Edit' : 'Cancel'}</Modal.Action>
        <Modal.Action passive onClick={saveHandler}>{!site.edit ? 'Close' : 'Save'}</Modal.Action>
        {site.code === '' ? 
        <Modal.Action passive onClick={() => ''}>Submit</Modal.Action>
        :
        <Modal.Action passive onClick={removeHandler}>Remove</Modal.Action>
        }
        </Modal>
        </>
      )
}

export default allUsers;