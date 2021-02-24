import {Table,Text,Button,Grid,Card,useToasts,Modal,Toggle,Spacer,Input,Pagination} from '@geist-ui/react';
import {ChevronLeft,ChevronRight} from '@geist-ui/react-icons';
import {useEffect, useState} from 'react';
import {TiTick,TiCancel} from 'react-icons/ti';
import {RiTakeawayFill,RiRestaurantFill} from 'react-icons/ri';
import React from 'react';
import {apigetOrder,apipatchOrder} from '../lib/orderapicontroller';
import { ShopContext } from '../lib/contextapi';
import Router from 'next/router';
import { isLogged } from '../lib/userapicontroller';

  const Order = () => {
    const operation = (actions, rowData) => {
        return <Button size="mini" shadow auto onClick={(e) => handler(rowData,actions)}>Show Order</Button>
    }
    const enabled = (actions, rowData) => {
        return (rowData.rowValue.shipped) ? <TiTick fontSize="24px"/> : <TiCancel fontSize="24px"/>
    }
    const date = (actions, rowData) => {
        const date = new Date(rowData.rowValue.created_at).toLocaleTimeString('he-IL', {day: '2-digit',month: '2-digit',hour: '2-digit', minute:'2-digit'});
        return <Text>{date}</Text>
    }
    const pdlist = (list) => {
        return list.map( (e) => {
            return (
            <Text key={e} style={{textAlign: 'center'}}>{e[0]} {e[2]} {e[1]}</Text>
            )});
    }
    const description = (actions ,rowData) => {
        return pdlist(rowData.rowValue.productlist);
    }
    const deliverytype = (actions, rowData) => {
        return rowData.rowValue.takeaway ?
        (<Text>Delivery <RiTakeawayFill/></Text>)
        : (<Text>Takeaway <RiRestaurantFill/></Text>)
    }
    const [shop,setShop] = React.useContext(ShopContext);
    const [state, setState] = useState(false)
    const [, setToast] = useToasts();
    const [order, setOrder] = useState({date: '', description: '',takeaway: false,phone: '',address: '',productlist: [],name: '',shipped: false,done: false});
    const [data,setData] = useState([]);
    const [pcount, setpcount] = useState(1);
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
    const resucemsg = () => {
        setShop({...shop,loading: true})
        setToast({type: 'error',text: `something went wrong!`})
        Router.replace('/')
    }
    useEffect(async () =>{
        setShop({...shop,loading: true})
        let data;
        if (shop.id === null || shop.id === undefined){
            const shopid = await isLogged();
            if (shopid.data.status.code === 200)
                data = await apigetOrder(shopid.data.data.shop_id);
            else
                resucemsg();
        }else{
            data = await apigetOrder(shop.id);
        }
        if (data.status === 200 && data.data !== null){
        let datalist = []
        data.data.forEach (item => {
            datalist.push({...item,date,deliverytype,description,operation,enabled})
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
        setOrder({...e.rowValue,remove: actions.remove,update: actions.update});
        setState(true);
    }
    const closeHandler = (event) => {
        setState(false)
    }

    const removeHandler = async () => { // marks as done
        const result = await apipatchOrder({done: true,id: order.id,shipped: order.shipped},shop.id);
        if (result.code === 200){
            const index = data.findIndex(e => e.id === order.id)
            const updatedata = [...data];
            updatedata.splice(index,1); // pops from clone array of data
            setData([...updatedata]) // set data
            setToast({type: 'warning',text: `Order : ${order.id} was marked done`})
        }else{
            setToast({type: 'error',text: `something went wrong!`})
        }
        setShop({...shop,loading: false});
        setState(false);
    }

    const toggleHandler = async (e) => {
        setShop({...shop,loading: true})
        setOrder({...order, shipped: e.target.checked});
        const result = await apipatchOrder({id: order.id,shipped: e.target.checked},shop.id);
        if (result.code === 200){
                const updatedate = [...data];
                const index = updatedate.findIndex((e) => e.id === order.id); // finds the order
                updatedate[index].shipped = e.target.checked; // changes shipped to true
                setData([...updatedate]) // updates data
                order.update(); // update data on table
                setToast({type: 'success',text: `Order : ${order.id} was ${(e.target.checked) ? `shipped` : `unshipped`}`})
            }else{
                setToast({type: 'error',text: `something went wrong!`})
        }
        setShop({...shop,loading: false})
    }

      return (
          <>
        <Grid.Container alignItems={"center"} justify={"center"}>
        <Grid xs alignItems={"center"} justify={"center"}>
        <Card style={{overflow: 'auto'}}type="violet" shadow>
            <Text h1 size="24px" className="align-center">Order Control Panel</Text>
        <Table hover={false} className="table-white" data={pcount === 1 ? data.slice(0,5) : data.slice((pcount-1) *5,pcount * 5)}>
          <Table.Column prop="date" label="date" />
          <Table.Column width="200" prop="name" label="name" />
          <Table.Column width="200" prop="description" label="description" />
          <Table.Column prop="deliverytype" label="deliverytype" />
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
        <Modal.Title>order {order.id}</Modal.Title>
        <Modal.Content>
        {order.productlist !== undefined && pdlist(order.productlist)}
        <Spacer/>
        <Input readOnly width="300px" label="DeliveryType" initialValue={ order.takeaway ? 'delivery' : 'takeaway' } />
        <Spacer/>
        <Input readOnly label="Name" initialValue={order.name} />
        <Spacer/>
        <Input readOnly label="Address" initialValue={order.address} />
        <Spacer/>
        <Input readOnly label="Phone" initialValue={order.phone} />
        <Spacer/>
        <Input readOnly label="Shipped" value={order.shipped} />
        </Modal.Content>
        <Modal.Action className="column-btn">
        <Text>Shipped <RiTakeawayFill/></Text>
        {<Toggle onChange={(e) => toggleHandler(e)}  initialChecked={order.shipped}/>}
        </Modal.Action>
        <Modal.Action passive onClick={removeHandler}>Mark as Done</Modal.Action>
        </Modal>
        </>
      )
}

export default Order;