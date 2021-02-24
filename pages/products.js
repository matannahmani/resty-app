import {Table,Text,Button,Grid,Card,useToasts,Modal,Toggle,Spacer,Input,Image,Loading,Textarea,Pagination} from '@geist-ui/react';
import {useState} from 'react';
import {TiTick,TiCancel} from 'react-icons/ti';
import {ChevronLeft,ChevronRight} from '@geist-ui/react-icons';
import {FaPizzaSlice} from 'react-icons/fa';
import React,{useEffect} from 'react';
import {apipostProduct,apigetProduct,apipatchProduct,apideleteProduct} from '../lib/pizzaapicontroller';
import { ShopContext } from '../lib/contextapi';
import SizeAdder from '../components/sizeadder';
import Router from 'next/router';
import { isLogged } from '../lib/userapicontroller';

const Products = () => {
    const operation = (actions, rowData) => {
        return <Button size="mini" shadow auto onClick={(e) => handler(rowData,actions)}>Show Pizza</Button>
    }
    const enabled = (actions, rowData) => {
        return (rowData.rowValue.status) ? <TiTick fontSize="24px"/> : <TiCancel fontSize="24px"/>
    }
    const shortdes = (actions, rowData) => {
        return (<Text small>{rowData.rowValue.description !== null ? rowData.rowValue.description.substring(0,50): 'no description'}</Text>)
    }
    const resucemsg = () => {
        setShop({...shop,loading: true})
        setToast({type: 'error',text: `something went wrong!`})
        Router.replace('/')
    }
    const [shop,setShop] = React.useContext(ShopContext);
    const [state, setState] = useState(false)
    const [, setToast] = useToasts();
    const [pizza, setPizza] = useState({name: '', price: '',jprice: '', photo: '',size: [],status: true,description: '',operation,enabled,shortdes});
    const pzcode = React.useRef();
    const pzprice = React.useRef();
    const pzjprice = React.useRef();
    const pzdesc = React.useRef();
    const pzphoto = React.useRef();
    const [data,setData] = useState([]);
    const [upload,setLoading] = useState(false);
    const [isupdating,setUpdate] = useState(false);
    const [newpizza,setNew] = useState(false);
    const [dataimage,setImage] = useState(undefined);
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
 
    useEffect(async () =>{
        setShop({...shop,loading: true})
        let data;
        if (shop.id === null || shop.id === undefined){
            const shopid = await isLogged();
            if (shopid.data.status.code === 200)
                data = await apigetProduct(shopid.data.data.shop_id);
            else
                resucemsg();
        }else{
            data = await apigetProduct(shop.id);
        }
    if (data.status === 200){
        let datalist = []
        data.data.forEach (item => {
            datalist.push({...item,photo: item.photo_url,key: item.id,operation,enabled,shortdes})
        });
        setData(datalist);
    }
    else{
        resucemsg();
    }
        setShop({...shop,loading: false})
    },[]);
    const handler = (e,actions) => {
        setPizza({...e.rowValue,remove: actions.remove,update: actions.update});
        setState(true);
    }
    const closeHandler = (event) => {
        setState(false)
        setNew(false);
        setUpdate(false);
    }
    
    const removeHandler = async () => {
        const index = data.findIndex(e => e.name === pizza.name)
        if (confirm(`are you sure you want to delete ${pizza.name}`)){
            const result = await apideleteProduct({id: data[index].id},shop.id);
            if (result.status === 200){
                setToast({type: 'warning',text: `${pizza.name} Pizza was removed`})
                const updatedata = [...data];
                updatedata.splice(index,1);
                setData([...updatedata]);
                setState(false);
            }else
            {
                resucemsg();
            }
        }
    }
    const addPizzaHandler = () => {
        setPizza({name: '', price: '',jprice: '', photo: '',size: [],status: true,description: '',enabled,operation,shortdes})
        setUpdate(true);
        setNew(true);
        setState(true);
    }
    const postPizza = async (updatepizza) => { // post / patch
        if (pizza.size.length > 0 && pzcode.current.value.length > 2 && pzprice.current.value.length > 1 && pzdesc.current.value.length > 10 && (pzphoto.current.files.length > 0 || !newpizza))
        {
            if (pzprice.current.value > 0 && pzprice.current.value < 201){
                const previewImage = document.getElementById('preview-img');
                const newcp = {...pizza,description: pzdesc.current.value, name: pzcode.current.value,photo: previewImage.src, price: pzprice.current.value, jprice: pzjprice.current.value};
                setLoading(true);
                let result;
                if (updatepizza && !newpizza)
                {
                    result = await apipatchProduct((({ operation, enabled,shortdes,key,photo_url,photo,product, ...o }) => o)({...newcp,photodata: dataimage}),shop.id );
                }
                else
                {
                    result = await apipostProduct((({ operation, enabled,shortdes,key,photo,id,product, ...o }) => o)({...newcp,photodata: dataimage}),shop.id );
                }
                if (result !== undefined && result.status === 200){
                    if (newpizza)
                    {
                        newcp.id = result.data.id;
                        delete newcp.data;
                        (data !== undefined ) ? setData([...data,{...newcp,photodata: null,shortdes}]) : setData([{...newcp,photodata: null,shortdes}]);
                        setToast({type: 'success',text: `${newcp.name} added successfully`})
                    }else
                    {
                        const updatedata = [...data]
                        const updateindex = updatedata.findIndex(e => e.id === pizza.id);
                        updatedata[updateindex] = {...updatedata[updateindex],...newcp}
                        setData(updatedata);
                        setToast({type: 'success',text: `${newcp.name} was updated successfully`})
                    }
                }
                else{
                    setToast({type: 'warning',text: `Something went wrong try again later`})
                }
                setImage(undefined);
                setLoading(false);
                return setState(false);
            }
        }
        setToast({type: 'error',text: 'Pizza must have 3 letters, must have size and price is capped at 250'})
    }
    
    const toggleHandler = (e) => {
        setPizza({...pizza, status:e.target.checked})
    }

    const sizeHandler = (e) => {
        setUpdate(true);
        setPizza({...pizza,size: e})
    }

    const loadImageHandler = async (e) => {
        const previewImage = document.getElementById('preview-img');
        previewImage.src = URL.createObjectURL(e.target.files[0]);
        const result = await toDataURL(previewImage.src);
        const updatedata = [...data];
        const index = updatedata.findIndex((e) => e.name === pizza.name)
        if (index !== null && pizza.name !== ''){
            updatedata[index].photo = URL.createObjectURL(e.target.files[0]); // switch with post source
            updatedata[index].data = result; // base64 of image
            setData([...updatedata]);
        }
        setImage(result);
        await setPizza({...pizza,photodata: result});
    }

    const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }))

      return (
        <>
        <Grid.Container alignItems={"center"} justify={"center"}>
        <Grid style={{overflow: 'auto'}} xs alignItems={"center"} justify={"center"}>
        <Card type="violet" shadow>
            <Text h1 size="24px" className="align-center">Products Control Panel</Text>
        <Table hover={false} className="table-white" data={pcount === 1 ? data.slice(0,5) : data.slice((pcount-1) *5,pcount * 5)}>
          <Table.Column prop="name" label="name" />
          <Table.Column prop="price" label="price" />
          <Table.Column prop="shortdes" label="description" width={120}/>
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
                <Button size="mini" shadow auto icon={<FaPizzaSlice/>} onClick={addPizzaHandler}>Add Product</Button>
            </Grid>
        </Grid.Container>
        </Card>
        </Grid>
        </Grid.Container>
        <Modal open={state} onClose={closeHandler}>
        <Modal.Title>Pizza</Modal.Title>
        <Spacer/>
        <Modal.Content className="p-0">
            <div className="align-center">
                <Input ref={pzcode}label="name" className="no-hover" clearable width="200px" style={{textAlign: "center"}} disabled={!isupdating || upload} initialValue={pizza.name}></Input>
                <Spacer/>
                <Input ref={pzprice} label="Price" type="number" min="1" max="200" className="no-hover" clearable labelRight="$" width="200px" style={{textAlign: "center"}} disabled={!isupdating || upload} initialValue={pizza.price}></Input>
                <Spacer/>
                <Input ref={pzjprice} label="UP-Price" type="number" min="1" max="30" className="no-hover" clearable labelRight="$" width="200px" style={{textAlign: "center"}} disabled={!isupdating || upload} initialValue={pizza.jprice}></Input>
            </div>
            <div className="align-center">
             <Textarea ref={pzdesc} placeholder="Please enter a description." width="200px"  disabled={!isupdating || upload} initialValue={pizza.description} />
            </div>
            <Image id="preview-img" src={(pizza.photo !== "") ? pizza.photo : `../pizza1.png`} width={160} height={160}/>
            <Spacer/>
            <div className="align-center">
            {isupdating && (upload ?
            <>
            <Loading size="large" color="black">Uploading</Loading>
            </>
            :
            <input ref={pzphoto} accept="image/x-png,image/gif,image/jpeg" onChange={(e) => loadImageHandler(e)} style={{width: '50%'}} type="file" />
            )}
            </div>
        </Modal.Content>
        <SizeAdder setSize={(e) => setPizza({...pizza,size: e})} size={pizza.size} name={pizza.name} state={{updating: isupdating, sizeHandler,upload}}/>
        <Spacer/>
        {upload ? 
        <Modal.Action className="loading-fix">
            <Loading size="large" color="black">Uploading</Loading>
        </Modal.Action>
        : // not uploading
        isupdating ? 
        [<Modal.Action passive key={'action-cancel'} onClick={() => setState(false)}>Cancel</Modal.Action>,
        <Modal.Action key={'action-toggler'}>{<Toggle onChange={(e) => toggleHandler(e)}  initialChecked={pizza.status}/>}</Modal.Action>,
        <Modal.Action passive key={'action-submit'} onClick={() => postPizza(true)}>Submit</Modal.Action>]
        :
        [<Modal.Action passive key={'action-update'} onClick={() => setUpdate(true)}>Update</Modal.Action>,
        <Modal.Action passive key={'action-remove'} onClick={removeHandler}>Remove</Modal.Action>
        ]
        }
        </Modal>
        </>
      )
}

export default Products;
