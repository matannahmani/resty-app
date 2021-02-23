import Link from 'next/link';
import {Result,Button} from 'antd'
const logout = () =>{
    return (
        <Result
        title="Successfully logged out!"
        extra={
            <Link href="./">
            <Button type="primary">Back Home
        </Button>
        </Link>}
      />
      )
    }
export default logout;