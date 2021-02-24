import {Table,Text,Button,Grid,Card,useToasts,Modal,Note,Spacer,Input,Pagination} from '@geist-ui/react';
import {ChevronLeft,ChevronRight} from '@geist-ui/react-icons';
import {useEffect, useState} from 'react';
import {TiTick,TiCancel} from 'react-icons/ti';
import {RiTakeawayFill,RiRestaurantFill} from 'react-icons/ri';
import React from 'react';
import {apigetDailyOrders,apipatchOrder} from '../lib/orderapicontroller';
import { ShopContext } from '../lib/contextapi';
import Router from 'next/router';
import { isLogged } from '../lib/userapicontroller';

  const DailyOrders = () => {
    const operation = (actions, rowData) => {
        return <Button size="mini" shadow auto onClick={(e) => handler(rowData,actions)}>Show Order</Button>
    }
    const enabled = (actions, rowData) => {
        return (rowData.rowValue.shipped) ? <TiTick fontSize="24px"/> : <TiCancel fontSize="24px"/>
    }

    const toTime = (time) => {
        return new Date(time).toLocaleTimeString('he-IL', {day: '2-digit',month: '2-digit',hour: '2-digit', minute:'2-digit'})
    }

    const date = (actions, rowData) => {
        return <Text>{toTime(rowData.rowValue.created_at)}</Text>
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
    const input = React.createRef()
    const [refund,setRefund] = useState({refund: false,msgloading: false,waiting: false});
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
                data = await apigetDailyOrders(shopid.data.data.shop_id);
            else
                resucemsg();
        }else{
            data = await apigetDailyOrders(shop.id);
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
        setRefund({refund: false,msgloading: false,waiting: false})
        setState(false)
    }

    const unDoneHandler = async () => {
        const result = await apipatchOrder({done: false,id: order.id,shipped: order.shipped},shop.id);
        if (result.code === 200){
            const index = data.findIndex(e => e.id === order.id)
            const updatedata = [...data];
            updatedata.splice(index,1); // pops from clone array of data
            setData([...updatedata]) // set data
            setToast({type: 'warning',text: `Order : ${order.id} was marked undone`})
        }else{
            setToast({type: 'error',text: `something went wrong!`})
        }
        setShop({...shop,loading: false});
        setState(false);
    }
    
    const refundHandler = () => {
        if (!refund.msgloading && !refund.waiting) return setRefund({...refund,msgloading: true})
        if (refund.msgloading && refund.waiting)
        {
            // issue refund
        }
    }

    const inputHandler = (e) =>{
        if (parseInt(e.target.value) === order.id)
        setRefund({...refund,msgloading: true,waiting: true})
        else
        setRefund({...refund,msgloading: true,waiting: false})
    }


      return (
          <>
        <Grid.Container alignItems={"center"} justify={"center"}>
        <Grid xs alignItems={"center"} justify={"center"}>
        <Card style={{overflow: 'auto'}}type="violet" shadow>
            <Text h1 size="24px" className="align-center">Today Orders : {data.length}</Text>
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
        <Spacer/>
        <Input readOnly label="Shipped" value={toTime(order.created_at)} />
        </Modal.Content>
        <Spacer/>
        { refund.msgloading &&
        <>
        <Note type="error">Please write order ID.</Note>
        <Spacer/>
        <div className="align-center">
            <Input ref={input} onChange={(e) => inputHandler(e)} status="error" width="100px" placeholder={order.id}/>
        </div>
        <Spacer/>
        </>
        }
        <Modal.Action>
        <Button shadow onClick={refundHandler} loading={refund.msgloading && !refund.waiting} size="medium" type="error-light">Refund</Button>
        </Modal.Action>
        <Modal.Action>
        <Button shadow onClick={unDoneHandler} loading={refund.msgloading && !refund.waiting} size="medium" type="success-light">Mark as Undone</Button>
        </Modal.Action>
        </Modal>
        </>
      )
}

export default DailyOrders;