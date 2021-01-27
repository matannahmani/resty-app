import { Form, Input, Button, Checkbox, Space, message } from 'antd';
import Link from 'next/link'
import { useContext, useState } from 'react';
import { UserContext } from '../lib/contextapi';
import { login } from '../lib/userapicontroller';
import {useRouter} from 'next/router'
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 6,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 0,
    span: 12,
  },
};

const Login = () => {
  const [load,setLoad] = useState(false);
  const [user,setUser] = useContext(UserContext);
  const router = useRouter();
  const onFinish = async (values) => {
      setLoad(true);
      const response = await login(values);
      if (response.status.code === 200)
      {
       setUser({...user,...response.data,login: true})
        message.success('Logged in successfully');
        router.push('/')
      }else{
        message.error('Username or Password are incorrect');
      }
      setLoad(false);
  };

  const onFinishFailed = (errorInfo) => {
    message.warning('Inputs are wrong');
    setLoad(false);

  };

  return (
    <div>
    <Form
      {...layout}
    layout="vertical"
      size="middle"
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space size="middle">
            <Button loading={load} type="primary" size="small" htmlType="submit">
            Submit
            </Button>
            <Link href="/forgotpassword">
            <Button loading={load} type="primary" size="small" >
            Forgot password
            </Button>
            </Link>
        </Space>
      </Form.Item>
    </Form>
    </div>
  )
}

export default Login;