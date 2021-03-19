import {axios,unSeralizer} from './libhelpers';

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
          return true;
        });
      // })
    }
  const isLogged = async() =>{
      return axios.get(`${process.env.API_URL}/login`).then(response => {
        return response
      });
  }
  const apigetUsers = async() =>{
    return axios.get(`${process.env.API_URL}/users`).then(response => {
      if (response.status === 200)
        return {data: unSeralizer(response.data), status: response.data.status}
      else
        return {data: null, status: 500}
    });
}

const apideleteUser = async (userid) =>
    await axios.delete(`${process.env.API_URL}/users/${userid}`)
      .then(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      })
      .catch(res =>{
        return {data: unSeralizer(res.data), status: res.data.status}
      });

const apipatchUser = async (props,userid) => 
      await axios.patch(`${process.env.API_URL}/users/${userid}`, {...props})
        .then(res => ({
          code: 200,
          data: res.data,
      }))
      .catch(() => ({
          code: 500,
          data: null,
          }),
      );
const apipostUser = async (props) => 
await axios.post(`${process.env.API_URL}/users`, props)
  .then(res =>{
    return {data: res.data, status: res.data.status}
  })
.catch(() => ({
    code: 500,
    data: null,
    }),
);

export {login,logout,isLogged,apideleteUser,apigetUsers,apipatchUser,apipostUser};