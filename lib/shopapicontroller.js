import {unSeralizer,axios} from './libhelpers';

const switchdelivery = async (props) => 
    await axios.post(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/switchdelivery`)
      .then((response) =>{
        if (response.status === 200)
        return {data: unSeralizer(response.data), status: response.data.status}
        else
          return {data: null, status: 500}
      })
      .catch((error) => {
        console.log(error);
});
const switchshop = async (props) => 
    await axios.post(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/switchshop`)
      .then((response) =>{
        if (response.status === 200)
        return {data: unSeralizer(response.data), status: response.data.status}
        else
          return {data: null, status: 500}
      })
      .catch((error) => {
        console.log(error);
});
const switchtakeaway = async (props) => 
    await axios.post(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/switchtakeaway`)
      .then((response) =>{
        if (response.status === 200)
        return {data: unSeralizer(response.data), status: response.data.status}
        else
          return {data: null, status: 500}
      })
      .catch((error) => {
        console.log(error);
});
  const shopstatus = async() =>{
      return axios.get(`${process.env.API_URL}/shops/${process.env.SHOP_ID}`).then(response => {
        if (response.status === 200)
          return {data: unSeralizer(response.data), status: response.data.status}
        else
          return {data: null, status: 500}
      });
  }

export {shopstatus,switchdelivery,switchshop,switchtakeaway};