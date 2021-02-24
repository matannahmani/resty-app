import {axios} from './libhelpers';

const login = (data) => {
      return axios.post(`${process.env.API_URL}/login`, {
        user:{...data}
      })
      .then(response => {
        return response.data;
      }).catch(error => {
        return error.response;
    });
  }
  const logout = async () => {
      // return axios.get(`${process.env.API_URL}/login`).then( () => {
      axios.delete(`${process.env.API_URL}/logout`)
        .then(response => {
          return false;
        });
      // })
    }
  const isLogged = async() =>{
      return axios.get(`${process.env.API_URL}/login`).then(response => {
        return response
      });
  }

export {login,logout,isLogged};