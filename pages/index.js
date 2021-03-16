import { UserContext } from "../lib/contextapi";
import React, { useState } from 'react';
const Index = () => {
    const [user,setUser] = React.useContext(UserContext);
    return (
        <div>
            {user.logged ? `Hey ${user.info.shopname}` : 'Please login!'}
        </div>
    )
}

export default Index;