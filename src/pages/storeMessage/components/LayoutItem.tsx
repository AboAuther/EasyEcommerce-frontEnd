/* eslint-disable import/order */
import { Layout, Menu, Breadcrumb, MenuProps } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  ContainerOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import logo from '../../home/components/images/logoDark.jpeg';
import logoLight from '../../home/components/images/logoLight.jpg';
import './layout.less';
import { useHistory } from '@modern-js/runtime/router';
import StoreDataMessage from './storeDataMessage';
import OwnerMessage from './ownerMessage';
import LicenseMessage from './licenseMessage';
import axios from 'axios';
import { DOMAIN } from '@/constants';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const LayoutItem = () => {
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory();
  const [source, setSource] = useState(null);
  const getSource = async () => {
    await axios
      .get(
        `${DOMAIN}/seller/getMessage?userID=${localStorage.getItem('userId')}`,
      )
      .then(res => {
        if (res.data.entity.success) {
          setSource(res.data.entity.data);
        }
      });
  };
  useEffect(() => {
    getSource();
  }, []);
  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const items: MenuItem[] = [
    getItem('销售数据', '1', <PieChartOutlined />),
    getItem('商品列表', '2', <DesktopOutlined />),
    getItem('已售订单', '3', <ContainerOutlined />),
    getItem('店铺信息', '4', <ContainerOutlined />),
  ];

  const hanldeOnclick = (item: { key: string }) => {
    const { key } = item;
    if (Number(key) === 1) {
      history.push('/admin');
    } else if (Number(key) === 4) {
      history.push('/storeMessage');
    } else if (Number(key) === 2) {
      history.push('./goodsList');
    } else if (Number(key) === 3) {
      history.push('/orderlist');
    }
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo">
          <img src={logo} width={135} style={{ margin: '0 0 0 35px' }} />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['4']}
          mode="inline"
          items={items}
          onClick={hanldeOnclick}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}>
            <StoreDataMessage source={source} />
            <OwnerMessage source={source} />
            <LicenseMessage source={source} getSource={getSource} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <img src={logoLight} className="lightLogo"></img>©2022 Created by
          Arthur
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutItem;
