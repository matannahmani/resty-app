import {unSeralizer,axios} from './libhelpers';

const apipostProduct = async (props,shopid) => 
    await axios.post(`${process.env.API_URL}/shops/${shopid}/products`, {product: props})
      .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
      .catch((error) => {
      });
const apipatchProduct = async (props,shopid) =>
    await axios.patch(`${process.env.API_URL}/shops/${shopid}/products/${props.id}`, {product: (({ id,product, ...o }) => o)(props)})
        .then(res =>{
            return {data: unSeralizer(res.data), status: res.data.status}
          })
      .catch(function (error) {
      });
const apideleteProduct = async (props,shopid) => 
    axios.delete(`${process.env.API_URL}/shops/${shopid}/products/${props.id}`)
    .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
      .catch(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      });

const apigetProduct = async (shopid) =>
await axios.get(`${process.env.API_URL}/shops/${shopid}/products`)
    .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
    .catch(() => ({
        code: 500,
        data: null,
        }),
    );

export {apipostProduct,apigetProduct,apipatchProduct,apideleteProduct};