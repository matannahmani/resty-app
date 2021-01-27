import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = `${process.env.API_URL}`;
axios.defaults.headers.common['Access-Control-Allow-Methods'] = "DELETE, POST, GET, PATCH";
axios.defaults.xsrfCookieName = "CSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-CSRF-Token";
axios.defaults.withCredentials = true;

const unSeralizer = (props) => {
    const unseralized = [];
    if (props.data === null)
        return null
    if (Array.isArray(props.data.data)){
        props.data.data.forEach(i => unseralized.push(i.attributes));
        return unseralized
    }
    else{
        return props.data.data.attributes
    }
}

export {unSeralizer,axios}