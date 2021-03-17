import {Select} from '@geist-ui/react';
const ResturantCatgeory = (props) => {
    return(
    <Select disabled={props.disabled} value={props.value} onChange={props.onChange} placeholder={props.placeholder} width="200px">
    <Select.Option label>Asian</Select.Option>
    <Select.Option value="ramen">Ramen</Select.Option>
    <Select.Option value="sushi">Sushi</Select.Option>
    <Select.Option label>American & Gril</Select.Option>
    <Select.Option value="burger">Burger</Select.Option>
    <Select.Option value="kebab">Kebab</Select.Option>
    <Select.Option label>Italian</Select.Option>
    <Select.Option value="pizza">Pizza</Select.Option>
    <Select.Option value="pasta">Pasta</Select.Option>
    </Select>
    )
}

export default ResturantCatgeory;