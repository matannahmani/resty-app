import { Table,Space } from 'antd';
import { useEffect, useState } from 'react';
import {apigetOrder} from '../lib/orderapicontroller';
import DataDrawer from './drawer';
import Drawer from './drawer';
const OrderTable = () => {      
    const [load,setLoad] = useState(true);
    const [columns,setColumns] = useState(
        [{
            title: 'Ordered At',
            dataIndex: 'created_at',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.age - b.age,
        },{
            title: 'Address',
            dataIndex: 'address',
        },{
            title: 'Name',
            dataIndex: 'name',
        },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <a onClick={() => handleDrawer(record)}>Show Order</a>
            <a>Delete</a>
          </Space>
        ),
    }
    ])
    const dateshort = (e) => {
        return new Date(e).toLocaleTimeString('he-IL', {day: '2-digit',month: '2-digit',hour: '2-digit', minute:'2-digit'});
    }
    const [drawerData,setDrawer] = useState({name: 'test'});

    const handleDrawer = (e) => {
        setDrawer(e)
        setOpen(true);
    }
    const [data,setData] = useState([{created_at: null,address: null,name: null}]);
    const [open,setOpen] = useState(false);
    useEffect( async() => {
        const response = await apigetOrder();
        if (response.status === 200 && response.data !== null){
            const newdata = response.data.map((e) => ({...e,created_at: dateshort(e.created_at)}))
        setData(newdata);
        }
        setLoad(false);
    }, [])
    return (
        <>
        <Drawer data={drawerData} title={'Order Info'} open={open} setOpen={setOpen}/>
        <Table columns={columns} loading={load} dataSource={data} />
        </>
    )
}
export default OrderTable;