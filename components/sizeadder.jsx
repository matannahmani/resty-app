import {Checkbox,Input,Button,Spacer,useToasts} from '@geist-ui/react';
import React from 'react';
const SizeAdder = (props) => {
    const input = React.createRef();
    const [toasts, setToast] = useToasts();
    const removeSize = (e) => {
        const newsize = [...props.size];
        newsize.splice(newsize.findIndex((size) => size === e),1)
        props.setSize([...newsize])
    }
    const addSize = () => {
        if (input.current !== null && input.current.value.length > 0  && input.current.value.length < 15 && !props.size.includes(input.current.value)){
            props.setSize([...props.size,input.current.value])
            setToast({type: 'success',text: `Added ${input.current.value}`})
        }
        else{
            setToast({type: 'error',text: `Input length must be bigger then 0 and smaller then 15 and cannot be duplicate`})
        }
    }
    return(
        <>
        <Checkbox.Group key={props.name} className="align-center" size="large" disabled={props.state.upload || !props.state.updating } onChange={props.state.sizeHandler} value={props.size}>
        {props.size.map((e) => {
            return (
                <Checkbox key={e} className="checkbox-fix" onChange={() => removeSize(e)} value={e}>{e}</Checkbox>
            )
        })}
        </Checkbox.Group>
        {props.state.updating &&
        <div>
            <Input ref={input} width="150px" label="Size" placeholder="M" />
            <Spacer/>
            {!props.state.upload &&
            <Button width="150px" onClick={addSize} size="small">Add</Button>
            }
        </div>
        }
        </>
    )
}

export default SizeAdder;