import {Table,Text,Button,Grid,Card,useToasts,Modal,Spacer,Input,Pagination} from '@geist-ui/react';
import {useEffect, useState} from 'react';
import {TiTick,TiCancel} from 'react-icons/ti';
import {ChevronLeft,ChevronRight} from '@geist-ui/react-icons'
import React from 'react';
import {apigetShops,apideleteShop, apipatchShop} from '../../lib/shopapicontroller';
import { ShopContext } from '../../lib/contextapi';
import Router from 'next/router';

  const allSites = () => {
    const operation = (actions, rowData) => {
        return <Button size="mini" shadow auto onClick={(e) => handler(rowData,actions)}>Show Resturant</Button>
    }
    const enabled = (actions, rowData) => {
        return (rowData.rowValue.open) ? <TiTick fontSize="24px"/> : <TiCancel fontSize="24px"/>
    }
    const link = (actions, rowData) => {
        return <a className="link" href={rowData.rowValue.url} target="_blank">{rowData.rowValue.url}</a>
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
            datalist.push({...item, operation,enabled, link})
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
        const result = await apideleteShop(site.id);
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

    const saveHandler = async () =>{
        const index = data.findIndex(e => e.name === site.name)
        if (site.edit)
        {
            if (site.name.length > 5 && validateEmail(site.users[0].email) && site.users[0].phone.length > 5 && site.users[0].name.length > 2)
            {
                const result = await apipatchShop(site,site.id);
                if (result.data.status === 200){
                    setToast({type: 'success',text: `${site.name} was updated`})
                    const updatedata = [...data]
                    updatedata[index] = {...site}
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
            <Text h1 size="24px" className="align-center">Sites Control Panel</Text>
        <Table hover={false} className="table-white" data={pcount === 1 ? data.slice(0,5) : data.slice((pcount-1) *5,pcount * 5)}>
          <Table.Column prop="name" label="Resturant Name" />
          <Table.Column prop="link" label="Resturant Link" />
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
        <Modal.Title>Resturant</Modal.Title>
        <Modal.Content>
        <div className="align-center">
            <Input onChange={(e) => setSite({...site,name: e.target.value})} label="name" disabled={!site.edit} initialValue={site.name !== '' ? site.name : ''} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="Resturant Name"/>
            <Spacer/>
            <Text>User Info</Text>
            <Input onChange={(e) => setSite({...site,users: [{...site.users[0],email: e.target.value}]})} label="email" disabled={!site.edit} initialValue={site.users !== undefined ? site.users[0].email : undefined} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="Resturant Name"/>
            <Spacer/>
            <Input onChange={(e) => setSite({...site,users: [{...site.users[0],phone: e.target.value}]})} label="phone" disabled={!site.edit} initialValue={site.users !== undefined ? site.users[0].phone : undefined} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="Resturant Phone"/>
            <Spacer/>
            <Input onChange={(e) => setSite({...site,users: [{...site.users[0],name: e.target.value}]})} label="name" disabled={!site.edit} initialValue={site.users !== undefined ? site.users[0].name : undefined} className="no-hover" clearable width="80%" style={{textAlign: "center"}} placeholder="Resturant User Name"/>
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

export default allSites;