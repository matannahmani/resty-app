import {unSeralizer,axios} from './libhelpers';

const login = (data) => {
    return axios.get(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/login`).then(response => {
      return axios.post(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/login`, {
        user:{...data}
      })
      .then(response => {
        return response.data;
      }).catch(error => {
        return error.response;
    });
    });
  }
  const logout = async () => {
      return axios.get(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/login`).then( () => {
        return axios.delete(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/logout`)
        .then(response => {
          return false;
        });
      })
    }
  const isLogged = async() =>{
      return axios.get(`${process.env.API_URL}/shops/${process.env.SHOP_ID}/login`).then(response => {
        return response
      });
  }

export {login,logout,isLogged};