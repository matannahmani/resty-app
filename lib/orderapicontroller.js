import {unSeralizer,axios} from './libhelpers';


const apipostOrder = async (props,shopid) => 
    await axios.post(`${process.env.API_URL}/shops/${shopid}/orders`, {order: props})
      .then(res => ({
        code: 200,
        data: res.data,
    }))
    .catch(() => ({
        code: 500,
        data: null,
        }),
    );
const apipatchOrder = async (props,shopid) => 
    await axios.patch(`${process.env.API_URL}/shops/${shopid}/orders/${props.id}`, {order: {shipped: props.shipped, done: props.done}})
      .then(res => ({
        code: 200,
        data: res.data,
    }))
    .catch(() => ({
        code: 500,
        data: null,
        }),
    );

const apigetOrder = async (shopid) =>
  await axios.get(`${process.env.API_URL}/shops/${shopid}/orders`)
    .then(res =>{
      return {data: unSeralizer(res.data), status: res.data.status}
    }
      )
    .catch(() => ({
        code: 500,
        data: null,
        }),
    );
const apigetDailyOrders = async (shopid) =>
    await axios.get(`${process.env.API_URL}/shops/${shopid}/dailyorders`)
      .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
      .catch(() => ({
          code: 500,
          data: null,
          }),
  );
const apicheckOrder = async (props,shopid) =>
await axios.get(`${process.env.API_URL}/shops/${shopid}/ordercheck`, {
  params: {
    'order[code]': props.code }
  })
    .then(res => ({
        code: 200,
        data: res.data.data.attributes,
    }))
    .catch(() => ({
        code: 500,
        data: null,
        }),
    );
const apicheckCart = async (props,shopid) =>
await axios.get(`${process.env.API_URL}/shops/${shopid}/checkcart`, {
  params: {
    'products': [...props] }
  })
    .then(res => (
        res.data
    ))
    .catch(() => ({
        code: 500,
        data: null,
        }),
    );
const apiapprovedOrder = async (props,shopid) =>
await axios.get(`${process.env.API_URL}/shops/${shopid}/orderstatus`, {
  params: {
    'id': props }
  })
    .then(res => ({
        code: 200,
        data: res.data.data.attributes,
    }))
    .catch(() => ({
        code: 500,
        data: null,
        }),
    );
export {apipostOrder,apigetOrder,apipatchOrder,apicheckOrder,apicheckCart,apiapprovedOrder,apigetDailyOrders};
