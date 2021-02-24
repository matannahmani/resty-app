import {unSeralizer,axios} from './libhelpers';

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

export {shopstatus,switchdelivery,switchshop,switchtakeaway};