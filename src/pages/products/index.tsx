import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Pagination, Empty } from 'antd';
import { Link } from '@modern-js/runtime/router';
import { productsList, FileList } from '../home/components/mock';
import './index.less';
import HeardSearch from '../home/components/heardSearch';
import banana from '../images/banana.webp';

const Product = () => {
  const current = 1;
  const total = 10;
  const pageSize = 8;
  const { Meta } = Card;
  const { Title } = Typography;
  const [filter, setFilter] = useState({});

  useEffect(() => {
    setFilter({});
  }, []);
  return (
    <div className="dm_Products">
      <HeardSearch currentIndex="2" isDisplay={false} />

      <div className="common_width">
        <div className="page-all">
          <div className="filter_title">
            <h1>商品筛选</h1>
            <span className="total">共 {total || 0} 件商品</span>
          </div>
          <div className="filter_condition">
            <Fragment>
              <Row>
                <Col span={2}>分类: </Col>
                <Col span={22}>
                  {FileList.classify.map((type, index) => (
                    <span key={index} onClick={() => console.log('click')}>
                      {type.label}
                    </span>
                  ))}
                </Col>
              </Row>
              <Row>
                <Col span={2}>价格: </Col>
                <Col span={22}>
                  {FileList.price.map((item, index) => (
                    <span key={index} onClick={() => console.log('click')}>
                      {item.label}
                    </span>
                  ))}
                </Col>
              </Row>
            </Fragment>
          </div>
          {productsList.length ? (
            <Row className="all_products">
              {productsList.map(item => (
                <Col span={6} key={item.id}>
                  <Card
                    key={item.id}
                    bordered={false}
                    cover={
                      <Link to={`/products/${item.id}`}>
                        <img alt="" src={banana} style={{ width: '100%' }} />
                      </Link>
                    }
                  />
                  <Meta
                    title={
                      <Title level={4}>
                        <span className="unit">¥</span>
                        {item.price ? Number(item.price).toFixed(2) : 0}
                      </Title>
                    }
                    description={
                      <Link to={`/products/${item.id}`}>
                        {item.description}
                      </Link>
                    }
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="抱歉！没有找到符合筛选条件的商品" />
          )}
          {total ? (
            <Pagination
              showQuickJumper={true}
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={() => console.log('change')}
              showTotal={total => `共 ${total}条`}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
