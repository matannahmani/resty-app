import {unSeralizer,axios} from './libhelpers';

const newshop = async (shop) => 
    await axios.post(`${process.env.API_URL}/createshop`,shop)
      .then((response) =>{
        if (response.status === 200)
        return response.data
        else
          return {data: null, status: 500}
      })
      .catch((error) => {
        console.log(error);
});

const switchdelivery = async (shopid) => 
    await axios.post(`${process.env.API_URL}/shops/${shopid}/switchdelivery`)
      .then((response) =>{
        if (response.status === 200)
        return {data: unSeralizer(response.data), status: response.data.status}
        else
          return {data: null, status: 500}
      })
      .catch((error) => {
        console.log(error);
});
const switchshop = async (shopid) => 
    await axios.post(`${process.env.API_URL}/shops/${shopid}/switchshop`)
      .then((response) =>{
        if (response.status === 200)
        return {data: unSeralizer(response.data), status: response.data.status}
        else
          return {data: null, status: 500}
      })
      .catch((error) => {
        console.log(error);
});
const switchtakeaway = async (shopid) => 
    await axios.post(`${process.env.API_URL}/shops/${shopid}/switchtakeaway`)
      .then((response) =>{
        if (response.status === 200)
        return {data: unSeralizer(response.data), status: response.data.status}
        else
          return {data: null, status: 500}
      })
      .catch((error) => {
        console.log(error);
});
const shopstatus = async(shopid) =>{
      return axios.get(`${process.env.API_URL}/shops/${shopid}`).then(response => {
        if (response.status === 200)
          return {data: unSeralizer(response.data), status: response.data.status}
        else
          return {data: null, status: 500}
      });
  }

const apigetShops = async() =>{
    return axios.get(`${process.env.API_URL}/shops`).then(response => {
      if (response.status === 200)
        return {data: unSeralizer(response.data), status: response.data.status}
      else
        return {data: null, status: 500}
    });
}

const apideleteShop = async (shopid) =>
    await axios.delete(`${process.env.API_URL}/shops/${shopid}`)
      .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
      .catch(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      });

const apipatchShop = async (props,shopid) => 
      await axios.patch(`${process.env.API_URL}/shops/${shopid}`, {shop: {name: props.name},user: {name: props.users[0].name,phone: props.users[0].phone,email: props.users[0].email,password: props.users[0].password}})
        .then(res => ({
          code: 200,
          data: res.data,
      }))
      .catch(() => ({
          code: 500,
          data: null,
          }),
      );
const getAllShops = async () => {
  return axios.get(`${process.env.API_URL}/allshops`).then(response => {
    if (response.status === 200)
      return {data: response.data, status: response.data.status}
    else
      return {data: null, status: 500}
  });
}
export {shopstatus,switchdelivery,switchshop,switchtakeaway,newshop,apigetShops,apideleteShop,apipatchShop,getAllShops};