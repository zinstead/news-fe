import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Space,
  Spin,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import styles from "./index.module.less";
import axios from "axios";
import { getPageMenuList, getUserToken } from "@/utils";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRequest } from "ahooks";
import { useLoadingStore, useSidebarStore } from "@/zustand/store";
import Auth from "@/components/Auth";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { isEmpty } from "lodash";

const { Header, Sider, Content } = Layout;

const transformTree = (data: any[]): any[] => {
  return data.map((item) => {
    // 只保留 key, label, 和 children 属性
    const { key, label, children } = item;
    return {
      key,
      label,
      children: isEmpty(children) ? null : transformTree(children), // 递归处理子节点
    };
  });
};

const NewsSandbox = () => {
  nProgress.start();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { username, role } = getUserToken();

  const items: MenuProps["items"] = [
    {
      key: "role",
      label: role?.roleName,
    },
    {
      key: "logout",
      label: "退出",
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedKeys = [pathname];
  const openKeys = ["/" + pathname.split("/")[1]];
  const loading = useLoadingStore((state) => state.loading);

  const setRefreshMenuList = useSidebarStore(
    (state) => state.setRefreshMenuList
  );

  const { data: menuList = [], refresh: refreshMenuList } = useRequest(
    async () => {
      const res = await axios.get(`/rights?_embed=children`);
      return res.data;
    }
  );
  const menuItems = transformTree(getPageMenuList(menuList, role?.rights));

  useEffect(() => {
    setRefreshMenuList(refreshMenuList);
  }, []);

  useEffect(() => {
    nProgress.done();
  });

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={styles.siderContainer}>
          <div className={styles.siderTitle}>全球新闻发布管理系统</div>
          <div className={styles.siderMenu}>
            <Menu
              theme="dark"
              mode="inline"
              items={menuItems}
              selectedKeys={selectedKeys}
              defaultOpenKeys={openKeys}
              onClick={(info) => {
                navigate(info.key);
              }}
            />
          </div>
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div style={{ padding: "0 24px" }}>
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
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Spin spinning={loading}>
            <Auth>
              <Outlet />
            </Auth>
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NewsSandbox;
