/* eslint-disable max-lines */
/* eslint-disable max-statements */
import {
  Button,
  Checkbox,
  Col,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Table,
  Typography,
  Alert,
} from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Icon from '@ant-design/icons';
import HeadSearch from '../home/components/headSearch';
import './index.less';
import BuyDrawer from '../paymentByCats/BuyDrawer';
import { DOMAIN } from '@/constants';
import nullImage from '@/images/noContent.png';

const ShoppingCat = () => {
  const [visible, setVisible] = useState(false);
  const [changeVisible, setChangeVisible] = useState(-1);
  const [source, setSource] = useState([]);
  const [chosenMap, setChosenMap] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNum, setTotalNum] = useState(0);
  const [settleFlag, setSettlementFlag] = useState(false);
  const getSource = async () => {
    const id = localStorage.getItem('userId');
    await axios.get(`${DOMAIN}/order/getCart?userID=${id}`).then(res => {
      if (res.data.entity.success) {
        setSource(res.data.entity.data);
      }
    });
  };
  useEffect(() => {
    getSource();
  }, []);
  useEffect(() => {
    if (settleFlag === false) {
      const result = chosenMap;
      if (Object.keys(result).length !== 0) {
        Object.keys(result).forEach(item => {
          result[item] = source.filter(goods => goods.ID === Number(item));
        });
      }
      chosenBuy(result);
      setChosenMap(result);
      handleTotal(result);
    } else {
      setChosenMap({});
    }
  }, [source]);
  const openDialog = () => {
    setVisible(true);
  };
  const closeDialog = () => {
    setVisible(false);
  };
  const handleChange = id => {
    if (changeVisible === id) {
      setChangeVisible(-1);
    } else {
      setChangeVisible(id);
    }
  };
  const handleNumChange = async (value, id) => {
    await axios({
      method: 'post',
      url: `${DOMAIN}/order/editCart`,
      data: {
        id,
        productNum: value,
      },
    }).then(res => {
      if (res.data.entity.success) {
        getSource();
        message.success('???????????????');
      }
    });
  };
  const handleMakeOrder = () => {
    if (source.length !== 0 && Object.keys(chosenMap).length !== 0) {
      openDialog();
    } else if (Object.keys(chosenMap).length === 0) {
      message.error('???????????????????????????');
    } else {
      message.error('????????????????????????????????????');
    }
  };
  const handleDeleteCart = async id => {
    const result = chosenMap;
    // ????????????
    await axios({
      method: 'post',
      url: `${DOMAIN}/order/deleteCart`,
      data: [{ id }],
    }).then(res => {
      if (res.data.entity.success) {
        delete result[id];
        setChosenMap(result);
        message.success('?????????????????????');
        getSource();
      } else {
        message.error('???????????????');
      }
    });
  };

  const handleChosen = id => {
    const result = chosenMap;
    if (!result[id]) {
      result[id] = source.filter(item => item.ID === id);
    } else {
      delete result[id];
    }
    setChosenMap(result);
    handleTotal(result);
  };
  const chosenBuy = map => {
    const tarArr = [];
    Object.keys(map).length !== 0 &&
      Object.keys(map).forEach(item => {
        tarArr.push(map[item][0]);
      });
    return tarArr;
  };
  const handleDeleteSomeCarts = async () => {
    // ????????????
    if (Object.keys(chosenMap).length === 0) {
      message.error('??????????????????');
    } else {
      await axios({
        method: 'post',
        url: `${DOMAIN}/order/deleteCart`,
        data: Object.keys(chosenMap).map(item => {
          return {
            id: Number(item),
          };
        }),
      }).then(res => {
        if (res.data.entity.success) {
          setChosenMap({});
          message.success('???????????????');
          getSource();
        }
      });
    }
  };
  const handleTotal = map => {
    let total = 0;
    let size = 0;
    if (Object.keys(map) !== 0) {
      const chosenList = chosenBuy(map);
      const priceList = chosenList.map(item => {
        return {
          total: item.productPrice * item.productNum,
          size: item.productNum,
        };
      });
      priceList.forEach(item => {
        total += item.total;
        size += item.size;
      });
      setTotalPrice(total);
      setTotalNum(size);
    }
  };

  const changeSettlement = value => {
    setSettlementFlag(value);
  };

  const columns: ColumnsType<Data> = [
    {
      title: '??????',
      dataIndex: 'productCoverImg',
      key: 'productCoverImg',
      align: 'center',
      width: '23%',
      render: (text, record) => {
        return (
          <Checkbox onChange={() => handleChosen(record.ID)}>
            <img
              className="imgs_style"
              src={text}
              alt={text}
              height={110}
              width={110}
            />
          </Checkbox>
        );
      },
    },
    {
      title: '??????',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      width: '20%',
    },
    {
      title: '??????',
      dataIndex: 'productPrice',
      key: 'productPrice',
      align: 'center',
      width: '13%',
      render: text => (Number(text) ? `???${Number(text).toFixed(2)}` : 0),
    },
    {
      title: '??????',
      dataIndex: 'productNum',
      key: 'productNum',
      align: 'center',
      width: '14%',
      render: (text, record) => (
        <InputNumber
          min={1}
          max={99}
          defaultValue={text}
          precision={0}
          disabled={record.ID !== changeVisible}
          onChange={value => handleNumChange(value, record.ID)}
        />
      ),
    },
    {
      title: '??????',
      dataIndex: 'totalprice',
      key: 'totalprice',
      align: 'center',
      width: '13%',
      render: (text, record) => {
        const num = record.productPrice * record.productNum;
        return `???${num.toFixed(2)}`;
      },
    },
    {
      title: '??????',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: '148px',
      render: (text, record) => (
        <div className="operation">
          <Popconfirm
            title="?????????????????????????????????"
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            onConfirm={() => {
              handleDeleteCart(record.ID);
            }}
            okText="???"
            cancelText="???">
            <span>??????</span>
          </Popconfirm>
          <Button
            type="text"
            className="changeButton"
            onClick={() => handleChange(record.ID)}>
            {changeVisible === record.ID ? '??????' : '??????'}
          </Button>
        </div>
      ),
    },
  ];

  const footer = () => {
    const total = totalPrice;
    const size = totalNum;

    return (
      <>
        <Row>
          <Col span={12} className="left">
            <Button onClick={handleDeleteSomeCarts}>????????????</Button>
          </Col>
          <Col span={12} className="right">
            <span className="num">
              ?????????<i>{size}</i>?????????
            </span>
            <div>
              ?????????<span>??{total.toFixed(2)}</span>
            </div>
            <span className="go-pay" onClick={handleMakeOrder}>
              ?????????
            </span>
          </Col>
        </Row>
        <BuyDrawer
          visible={visible}
          onClose={closeDialog}
          total={total}
          shoppingCatsList={
            Object.keys(chosenMap).length === 0 ? [] : chosenBuy(chosenMap)
          }
          getSource={getSource}
          changeSettlement={value => changeSettlement(value)}
        />
      </>
    );
  };

  return (
    <div className="content">
      <div className="orderHead">
        <HeadSearch currentIndex={''} isDisplay={true} />
      </div>
      {!localStorage.getItem('userId') ? (
        <div>
          <Alert description="??????????????????" type="warning" showIcon closable />
          <div className="nullPage">
            <img src={nullImage} className="nullImage" />
          </div>
        </div>
      ) : (
        <div className="orderContent">
          <div className="content_card">
            <div className="common_width dm_MyShoppingCart">
              <Row className="table_title">
                <Typography.Title level={4}>???????????????</Typography.Title>
                <div>
                  ???????????????????????? <i>{source.length}</i> ????????????
                </div>
              </Row>
              <Table
                columns={columns}
                dataSource={source}
                pagination={false}
                footer={() => footer(chosenMap)}
                bordered={true}
                rowKey={record => record.ID}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCat;
