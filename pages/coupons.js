import {Table,Text,Button,Grid,Card,useToasts,Modal,Toggle,Spacer,Input,Pagination} from '@geist-ui/react';
import {useEffect, useState} from 'react';
import {TiTick,TiCancel} from 'react-icons/ti';
import {ChevronLeft,ChevronRight} from '@geist-ui/react-icons'
import {RiCoupon2Fill} from 'react-icons/ri';
import React from 'react';
import {apipostCoupon,apigetCoupon,apipatchCoupon,apideleteCoupon} from '../lib/couponapicontroller';
import { ShopContext } from '../lib/contextapi';
import Router from 'next/router';

  const Coupon = () => {
    const operation = (actions, rowData) => {
        return <Button size="mini" shadow auto onClick={(e) => handler(rowData,actions)}>Show Coupon</Button>
    }
    const enabled = (actions, rowData) => {
        return (rowData.rowValue.status) ? <TiTick fontSize="24px"/> : <TiCancel fontSize="24px"/>
    }
    const [shop,setShop] = React.useContext(ShopContext);
    const [state, setState] = useState(false)
    const [pcount, setpcount] = useState(1);
    const [, setToast] = useToasts();
    const [coupon, setCoupon] = useState({code: '', discount: '',enabled: false});
    const cpcode = React.useRef();
    const cpdiscount = React.useRef();
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
        const data = await apigetCoupon(shop.id);
        if (data.status === 200 && data.data !== null){
        let datalist = []
        data.data.forEach (item => {
            Array.from({ length: 6 }, (x, i) => {
                // something();
                datalist.push({...item,discount: `${item.discount}%`,operation,enabled})
            });
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
        setCoupon({...e.rowValue,remove: actions.remove,update: actions.update});
        setState(true);
    }
    const closeHandler = (event) => {
        setState(false)
    }

    const removeHandler = async () => {
        const index = data.findIndex(e => e.code === coupon.code)
        const result = await apideleteCoupon({id: data[index].id},shop.id);
        if (result.status === 200){
            setToast({type: 'warning',text: `CODE : ${coupon.code} was removed`})
            const updatedata = [...data];
            updatedata.splice(index,1);
            setData([...updatedata]);
        }
        else {
            setToast({type: 'error',text: `ERROR`})
        }
        setState(false);
    }
    const addCouponHandler = () => {
        setCoupon({code: '', discount: '', status: true, enabled, operation})
        setState(true);
    }
    const postCoupon = async () => {
        if (cpcode.current.value.length > 2 && cpdiscount.current.value.length > 1)
        {
            if (cpdiscount.current.value > 0 && cpdiscount.current.value < 51){
                const newcp = {...coupon,code: cpcode.current.value, discount: cpdiscount.current.value};
                const result = await apipostCoupon((({ operation, enabled, ...o }) => o)(newcp),shop.id );
                if (result.status === 200){
                    newcp.id = result.data.id;
                    (data !== undefined ) ? setData([...data,{...newcp,discount: `${newcp.discount}%`}]) : setData([{...newcp,discount: `${newcp.discount}%`}]);
                    setToast({type: 'success',text: `CODE : ${cpcode.current.value} added successfully`})
                }
                else{
                    setToast({type: 'error',text: `something went wrong!`})
                }
                return setState(false);
            }
        }
        setToast({type: 'error',text: 'Coupon must have 3 letters and discount is capped at 50%'})
    }
    const toggleHandler = async (e) => {
        setShop({...shop,loading: true})
        setCoupon({...coupon, status:e.target.checked});
        if (coupon.code !== ''){
            const result = await apipatchCoupon({status: e.target.checked,id: coupon.id},shop.id);
            if (result.status === 200){
                const updatedate = [...data];
                const index = updatedate.findIndex((e) => e.code === coupon.code);
                updatedate[index].status = e.target.checked;
                setData([...updatedate])
                coupon.update();
                setToast({type: 'success',text: `CODE : ${coupon.code} was ${(e.target.checked) ? `enabled` : `disabled`}`})
            }else{
                setToast({type: 'error',text: `something went wrong!`})
            }
        }
        setShop({...shop,loading: false})
    }

      return (
          <>
        <Grid.Container alignItems={"center"} justify={"center"}>
        <Grid style={{overflow: 'auto'}} xs alignItems={"center"} justify={"center"}>
        <Card type="violet" shadow>
            <Text h1 size="24px" className="align-center">Coupon Control Panel</Text>
        <Table hover={false} className="table-white" data={pcount === 1 ? data.slice(0,5) : data.slice((pcount-1) *5,pcount * 5)}>
          <Table.Column prop="code" label="code" />
          <Table.Column prop="discount" label="discount" />
          <Table.Column prop="enabled" label="enabled" />
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
                <Button size="mini" shadow auto icon={<RiCoupon2Fill/>} onClick={addCouponHandler}>Add Coupon</Button>
            </Grid>
        </Grid.Container>
        </Card>
        </Grid>
        </Grid.Container>
        <Modal open={state} onClose={closeHandler}>
        <Modal.Title>Coupon</Modal.Title>
        <Modal.Content>
        <div className="align-center">
            <Input ref={cpcode}label="code" disabled={coupon.code !== ''} initialValue={coupon.code !== '' ? coupon.code : ''} className="no-hover" clearable width="200px" style={{textAlign: "center"}} placeholder="10OFF"/>
            <Spacer/>
            <Input ref={cpdiscount} label="discount" disabled={coupon.discount !== ''} initialValue={coupon.discount !== '' && parseInt(coupon.discount)} type="number" min="1" max="50" className="no-hover" clearable labelRight="%" width="200px" style={{textAlign: "center"}} placeholder="10"></Input>
        </div>
        </Modal.Content>
        <Modal.Action passive onClick={() => setState(false)}>Cancel</Modal.Action>
        <Modal.Action>{<Toggle onChange={(e) => toggleHandler(e)}  initialChecked={coupon.status}/>}</Modal.Action>
        {coupon.code === '' ? 
        <Modal.Action passive onClick={postCoupon}>Submit</Modal.Action>
        :
        <Modal.Action passive onClick={removeHandler}>Remove</Modal.Action>
        }
        </Modal>
        </>
      )
}

export default Coupon;