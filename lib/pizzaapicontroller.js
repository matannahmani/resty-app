import {unSeralizer,axios} from './libhelpers';

const apipostProduct = async (props) => 
    await axios.post(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/products`, {product: props})
      .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
      .catch((error) => {
      });
const apipatchProduct = async (props) =>
    await axios.patch(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/products/${props.id}`, {product: (({ id,product, ...o }) => o)(props)})
        .then(res =>{
            return {data: unSeralizer(res.data), status: res.data.status}
          })
      .catch(function (error) {
      });
const apideleteProduct = async (props) => 
    axios.delete(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/products/${props.id}`)
    .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
      .catch(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      });

const apigetProduct = async () =>
await axios.get(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/products`)
    .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
    .catch(() => ({
        code: 500,
        data: null,
        }),
    );

export {apipostProduct,apigetProduct,apipatchProduct,apideleteProduct};