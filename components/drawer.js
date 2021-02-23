import { Drawer, Col, Row } from 'antd';
import { Input } from 'antd';

const DataDrawer = (props) =>{
    const onClose = () => {
        props.setOpen(false);
    };
    return (
        <>
          <Drawer
            width={300}
            placement="right"
            onClose={onClose}
            visible={props.open}
          >
            <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
              {props.title}
            </p>
            <Row>
                {console.log(props.data)}
                {Object.entries(props.data).map(([key,value]) => {
                    return(
                    <Col span={24}>
                        <Input style={{padding: '8px'}} addonBefore={key} value={value}/>
                    </Col>
                    )
                })}

            </Row>
          </Drawer>
        </>
      );
}

export default DataDrawer;