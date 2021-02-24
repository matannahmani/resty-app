import {useState, useEffect} from 'react';

const DelayedRender = (props) => {
    const [render,setRender] = useState(false);
    useEffect(() => {
      setTimeout(() => {
        setRender(true)
      }, props.time);
    }, [])
    return(
      <>
      {render && props.children}
      </>
    )
  }
export default DelayedRender;