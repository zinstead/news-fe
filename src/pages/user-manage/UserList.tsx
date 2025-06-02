import { apiPrefix } from '@/api';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Form, Input, Modal, Select, Space, Switch, Table, TableProps } from 'antd';
import { BaseOptionType, DefaultOptionType } from 'antd/es/select';
import axios from 'axios';
import { useState } from 'react';

const roleMap: Record<number, string> = {
  1: '超级管理员',
  2: '区域管理员',
  3: '区域编辑'
}

interface DataType {
  id: number;
  username: string;
  region: string;
  role: { id: number, roleName: string, roleType: number, rights: string[] };
  roleState: boolean;
  default: boolean;
}

const UserList = () => {
  const [visible, setVisible] = useState(false);

  const { data: userList } = useRequest(async () => {
    const res = await axios.get(`${apiPrefix}/users?_expand=role`);
    return res.data;
  });

  const regionOptions: DefaultOptionType[] = [
    {
      label: '亚洲',
      value: '亚洲'
    },
    {
      value: '欧洲',
      label: '欧洲'
    },
    {
      label: '北美洲',
      value: '北美洲'
    },
    {
      label: '南美洲',
      value: '南美洲'
    },
    {
      label: '非洲',
      value: '非洲'
    },
    {
      label: '大洋洲',
      value: '大洋洲'
    },
    {
      label: '南极洲',
      value: '南极洲'
    },
  ]

  const columns: TableProps<DataType>['columns'] = [
    {
      dataIndex: 'username',
      title: '用户名',
    },
    {
      dataIndex: 'region',
      title: '区域',
      render(value, record, index) {
        return value ? value : '全球';
      },
    },
    {
      dataIndex: 'role',
      title: '角色',
      render(value, record, index) {
        return value.roleName;
      },
    },
    {
      dataIndex: 'roleState',
      title: '用户状态',
      render(value, record, index) {
        return <Switch defaultChecked={value} disabled={record.default} />;
      },
    },
    {
      title: '操作',
      render(value, record, index) {
        return (
          <Space>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              disabled={record.default}
            ></Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              shape="circle"
              disabled={record.default}
            ></Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Button style={{ marginBottom: 20 }} type='primary' onClick={() => { setVisible(true) }}>添加用户</Button>
      <Table columns={columns} dataSource={userList} pagination={{ pageSize: 5 }} rowKey={'id'} />

      <Modal title='添加用户' open={visible} onCancel={() => { setVisible(false) }}>
        <Form layout='vertical'>
          <Form.Item label='用户名' name='username'>
            <Input />
          </Form.Item>
          <Form.Item label='密码' name='password'>
            <Input />
          </Form.Item>
          <Form.Item label='区域' name='region'>
            <Select options={regionOptions}></Select>
          </Form.Item>
          <Form.Item label='角色' name='roleId'>
            <Select options={[{ label: '超级管理员', value: 1 }, { label: '区域管理员', value: 2 }, { label: '区域编辑', value: 3 }]}></Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
