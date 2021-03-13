import {unSeralizer,axios} from './libhelpers';

const apipostCoupon = async (props,shopid) => 
    await axios.post(`${process.env.API_URL}/shops/${shopid}/coupons`, {coupon: props})
      .then(res =>{
        return {data: res.data, status: res.data.status}
      })
    .catch(() => ({
        code: 500,
        data: null,
        }),
    );
const apipatchCoupon = async (props,shopid) =>
    await axios.patch(`${process.env.API_URL}/shops/${shopid}/coupons/${props.id}`, {coupon: {status: props.status}})
      .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
      .catch(() => ({
          code: 500,
          data: null,
          }),
      );
const apideleteCoupon = async (props,shopid) =>
    await axios.delete(`${process.env.API_URL}/shops/${shopid}/coupons/${props.id}`)
      .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
      .catch(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      });
const apigetCoupon = async (shopid) =>
await axios.get(`${process.env.API_URL}/shops/${shopid}/coupons`)
    .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
    .catch(() => ({
        code: 500,
        data: null,
        }),
    );
const apicheckCoupon = async (props,shopid) =>
await axios.get(`${process.env.API_URL}/shops/${shopid}/couponcheck`, {
  params: {
    'coupon[code]': props.code }
  })
    .then(response => {
        return {data: unSeralizer(response.data), status: response.data.status}
    })
    .catch(() => ({
        code: 500,
        data: null,
        }),
    );
export {apipostCoupon,apigetCoupon,apipatchCoupon,apideleteCoupon,apicheckCoupon};