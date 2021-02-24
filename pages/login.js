import {Grid,Button,Card,Spacer,Input,Dot,useToasts} from '@geist-ui/react';
import React,{useState,useEffect,useContext} from 'react';
import { useRouter } from 'next/router';
import {login} from '../lib/userapicontroller';
import { UserContext } from '../lib/contextapi';

const AdminLogin = () => {
    const username = React.createRef();
    const password = React.createRef();
    const [, setToast] = useToasts();
    const [loading,setLoading] = useState(false);
    const [user,setUser] = React.useContext(UserContext);
    const router = useRouter();
    const loginHandler = async () =>{
        setLoading(true);
        if (username !== null && password !== null)
            if (username.current.value.length > 4 && password.current.value.length > 4){
                const result = await login({email: username.current.value,password: password.current.value});
                if (result.status !== 401 && result.status.code === 200){
                    setUser({...user,...result.data});
                    localStorage.setItem('user', JSON.stringify(result.data));
                    setToast({type: "success",text: "התחברת בהצלחה עובר לפנאל ניהול..."});
                    router.push('admin/dashboard')        
                }
                else{
                    setToast({type: "warning",text: "איימל או סיסמא לא נכונים"});
                }
            }
            else{
                setToast({type: "warning",text: "איימל או סיסמא קצרים מדי"});
            }
        setLoading(false);
    }
    useEffect(() => {
        if (user.adminlevel > 0){
            router.push('/admin/dashboard');
            setToast({type: "success",text: "התחברת בהצלחה עובר לפנאל ניהול..."});
        }
    }, [])
    return (
        <Grid.Container justify={"center"}>
            <Grid xs="22" md="22" >
            <Card shadow type={"lite"}>
            <Grid.Container direction={"column"} gap={2} alignItems={"center"} justify={"center"}>
            <Spacer/>
            <Input ref={username} name="email" autoComplete="on" placeholder="Admin" width="240px">
            <Dot color="black" type="success">Email</Dot>
            </Input>
            <Spacer/>
            <Input.Password ref={password} name="password" autoComplete="on" width="240px">
            <Dot color="black" type="success">Password</Dot>
            </Input.Password>
            <Spacer/>
            <Grid style={{textAlign: "center"}}>
                <Button loading={loading} shadow size="medium" auto onClick={loginHandler} type="secondary">Login</Button>
            </Grid>
            </Grid.Container>
            </Card>
            </Grid>
        </Grid.Container>
    )
}
export default AdminLogin;