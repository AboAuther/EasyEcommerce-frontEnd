import { Row, Col } from 'antd';
import './layout.less';

const OwnerMessage = props => {
  const { source } = props;
  const styles = {
    dataItem: {
      display: 'flex',
      flexBasis: '50%',
      padding: '20px',
      alignItems: 'center',
    },
    dataItemImg: {
      width: '58px',
      height: '58px',
      marginRight: '30px',
    },
    dataItemUnit: {
      height: '72px',
      display: 'flex',
      flexBasis: '50%',
      // flexDirection: 'column',
      justifyContent: 'space-between',
    },
    unitTitle: {
      color: '#666',
      fontSize: '12px',
    },
    unitAmount: {
      color: '#333',
      fontSize: '24px',
    },
    unitFooter: {
      color: '#999',
      fontSize: '12px',
    },
    shopItem: {
      color: '#333',
      fontSize: '22px',
      margin: '0 0 19px 0 ',
    },
  };

  return (
    <div className="real-content">
      <span>
        <p className="title">个人信息</p>
      </span>
      <Row wrap>
        <Col span={12}>
          <div style={styles.dataItem}>
            <img
              src={require('./images/shopName.png')}
              alt=""
              style={styles.dataItemImg}
            />
            <div className="dataItemOwner">
              <div style={styles.unitTitle}>身份证号码</div>
              <div style={styles.shopItem}>{source?.identity}</div>
            </div>
            <div className="dataItemOwner">
              <div style={styles.unitTitle}>联系方式</div>
              <div style={styles.shopItem}>{source?.mobile}</div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div style={styles.dataItem}>
            <img
              src={require('./images/storeAddress.png')}
              alt=""
              style={styles.dataItemImg}
            />
            <div className="dataItemOwner">
              <div style={styles.unitTitle}>个人地址</div>
              <div style={styles.shopItem}>{source?.address}</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OwnerMessage;
