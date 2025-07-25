import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Space,
  theme,
} from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.module.less';
import axios from 'axios';
import { getPageMenuList } from '@/utils';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { apiPrefix } from '@/api';
import { useSidebarStore } from '@/zustand/store';

const { Header, Sider, Content } = Layout;

const NewsSandbox = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userToken = localStorage.getItem('token') ?? `{}`;
  const { username, role } = JSON.parse(userToken);

  const items: MenuProps['items'] = [
    {
      key: 'role',
      label: role?.roleName,
    },
    {
      key: 'logout',
      label: '退出',
      onClick: () => {
        localStorage.removeItem('token');
        navigate('/login');
      },
    },
  ];

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedKeys = [pathname];
  const openKeys = ['/' + pathname.split('/')[1]];

  const setRefreshMenuList = useSidebarStore(state => state.setRefreshMenuList);

  const { data: menuList = [], refresh: refreshMenuList } = useRequest(
    async () => {
      const res = await axios.get(`${apiPrefix}/rights?_embed=children`);
      return res.data;
    },
  );

  useEffect(() => {
    setRefreshMenuList(refreshMenuList);
  }, []);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={styles.siderContainer}>
          <div className={styles.siderTitle}>全球新闻发布管理系统</div>
          <div className={styles.siderMenu}>
            <Menu
              theme="dark"
              mode="inline"
              items={getPageMenuList(menuList, role.rights)}
              selectedKeys={selectedKeys}
              defaultOpenKeys={openKeys}
              onClick={info => {
                navigate(info.key);
              }}
            />
          </div>
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div style={{ padding: '0 24px' }}>
              <Space>
                <span>欢迎回来，{username}</span>
                <Dropdown menu={{ items }}>
                  <Avatar size={32} icon={<UserOutlined />} />
                </Dropdown>
              </Space>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default NewsSandbox;
