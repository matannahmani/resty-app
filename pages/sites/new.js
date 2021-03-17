import {Grid, Slider,Card,Input,Spacer,Text,Select,Button,Row,Loading,useToasts,User} from '@geist-ui/react';
import {useState, useEffect } from 'react';
import { isLogged } from '../../lib/userapicontroller';
import { useRouter } from 'next/router'
import { newshop } from '../../lib/shopapicontroller';
import ResturantCatgeory from '../../components/resCategory';
const NewSite = () => {

    const [page,setPage] = useState({loading: true,allowed: false})
    const [resturant,setResturant] = useState({stage: 1,data: {name: null,category: null,address: null,user: {name: null,phone: null,email: null,password: null}}})
    const router = useRouter()
    const [, setToast] = useToasts()

    useEffect(async () => {
        const response = await isLogged();
        if (response.data.status.code === 200 && response.data.data.adminlevel > 1)
            setPage({loading: false,allowed: true})
        else
            router.push('/')
    }, [])

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    const checkPassword = (str) => {
        const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(str);
    }

    const nextPage = () => {
        if (resturant.stage === 1 && resturant.data.name !== null && resturant.data.name.length > 3 && resturant.data.category !== null)
        {
            setResturant({...resturant,stage: 2})
        }
        else if (resturant.stage === 2 && resturant.data.user.email !== null, validateEmail(resturant.data.user.email) === true
        && resturant.data.user.name !== null && resturant.data.user.name.length > 3 && resturant.data.user.password !== null
        && checkPassword(resturant.data.user.password)){
            setResturant({...resturant,stage: 3})
        }
        else {
            setToast({type: "error", text: "Please fill Resturant name and Category"})
        }
    }
    
    const createResturant = async () => {
        setPage({...page,loading: true});
        const response = await newshop(resturant.data);
        if (response.status == 200){
            setToast({type: "success", text: "Shop and User Created!"})
            router.push('/')
        }
        else
            await setToast({type: "error", text: response.msg})
        setPage({...page,loading: false});
    }
    return (
        page.loading && !page.allowed ? 
        <div>
        <Row style={{ padding: '10px 0'}}>
            <Card>
                <Loading>Loading</Loading>
            </Card>
        </Row>
        </div>
        :
        <div>
        <Grid.Container direction="column" gap={3}>
        <Grid xs>
        <Card>
        <Slider min={1} max={3} value={resturant.stage} step={1} showMarkers disabled/>
        </Card>
        </Grid>
        <Grid xs>
            <Card>
            {resturant.stage === 1 &&
            <>
            <Spacer />
            <Text h3>Resturant Name</Text>
            <Input value={resturant.data.name} onChange={(e) => setResturant({...resturant,data:{...resturant.data,name: e.currentTarget.value}})} placeholder="Burger Show" width="200px">
            </Input>
            <Spacer />
            <Text h3>Resturant Address</Text>
            <Input value={resturant.data.address} onChange={(e) => setResturant({...resturant,data:{...resturant.data,address: e.currentTarget.value}})} placeholder="3-20 Haengdang-dong, Seongdong-gu, Seoul" width="200px">
            </Input>
            <Spacer />
            <Text h3>Resturant Category</Text>
            <ResturantCatgeory value={resturant.data.category} onChange={(e) => setResturant({...resturant,data:{...resturant.data,category: e}})} placeholder="Burger" />
            </>
            }
            {resturant.stage === 2 &&
            <>
            <Text h3>User Name</Text>
            <Input value={resturant.data.user.name} onChange={(e) => setResturant({...resturant,data:{...resturant.data,user:{...resturant.data.user, name: e.currentTarget.value}}})} placeholder="Matan" width="200px">
            </Input>
            <Spacer/>
            <Text h3>User Phone</Text>
            <Input value={resturant.data.user.phone} onChange={(e) => setResturant({...resturant,data:{...resturant.data,user:{...resturant.data.user, phone: e.currentTarget.value}}})} placeholder="010-2131-3553" width="200px">
            </Input>
            <Spacer/>
            <Text h3>User Email</Text>
            <Input value={resturant.data.user.email} onChange={(e) => setResturant({...resturant,data:{...resturant.data,user:{...resturant.data.user, email: e.currentTarget.value}}})} placeholder="matan@gmail.com" width="200px">
            </Input>
            <Spacer/>
            <Text h3>User Password</Text>
            <Input.Password value={resturant.data.user.password} onChange={(e) => setResturant({...resturant,data:{...resturant.data,user:{...resturant.data.user, password: e.currentTarget.value}}})} placeholder="secret" width="200px">
            </Input.Password>
            <Spacer/>
            </>
            }
            {resturant.stage === 3 &&
            <div>
            <Spacer/>
            <User src="https://unix.bio/assets/avatar.png" name={resturant.data.user.name}>
            {resturant.data.name} | {resturant.data.category}
            </User>
            <Spacer/>
            </div>
            }
            <Spacer/>
            <Row style={{flexWrap: 'wrap'}} align="middle" justify={resturant.stage > 1 ? "space-between" : "end"}>
            {resturant.stage > 1 && 
            <Button style={{margin: '8px'}} onClick={() => setResturant({...resturant,stage: resturant.stage-1})} loading={page.loading} type="success">Previous</Button>
            }
            {resturant.stage !== 3 ?
            <Button style={{margin: '8px'}} onClick={nextPage} loading={page.loading} type="success">Next</Button>
            :
            <Button style={{margin: '8px'}} onClick={createResturant} loading={page.loading} type="success">Create Resturant</Button>
            }
            </Row>
            </Card>
        </Grid>
        </Grid.Container>
        </div>
    )
}

export default NewSite