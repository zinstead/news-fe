import { apiPrefix } from '@/api';
import UserForm from '@/components/UserForm';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  TableProps,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { useState } from 'react';

interface DataType {
  id: number;
  username: string;
  region: string;
  role: { id: number; roleName: string; roleType: number; rights: string[] };
  roleState: boolean;
  default: boolean;
}

const UserList = () => {
  const [addVisible, setAddVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [addForm] = useForm();
  const [updateForm] = useForm();
  const [editId, setEditId] = useState<number>();

  const { data: userList, refresh: refreshUserList } = useRequest(async () => {
    const res = await axios.get(`${apiPrefix}/users?_expand=role`);
    return res.data;
  });

  const { data: regionList = [] } = useRequest(async () => {
    const res = await axios.get(`${apiPrefix}/regions`);
    return res.data;
  });
  const regionFilters = [
    ...regionList.map((item: { value: string }) => ({
      value: item.value,
      text: item.value,
    })),
    { value: '', text: '全球' },
  ];

  const { data: roleList = [] } = useRequest(async () => {
    const res = await axios.get(`${apiPrefix}/roles`);
    return res.data;
  });
  const roleOptions = roleList.map(
    (item: { id: string; roleName: string }) => ({
      id: item.id,
      value: item.id,
      label: item.roleName,
    }),
  );

  const onAddUser = () => {
    addForm.validateFields().then(async () => {
      const data = addForm.getFieldsValue();
      const res = await axios.post(`${apiPrefix}/users`, {
        ...data,
        roleState: true,
        default: false,
      });
      if (res) {
        setAddVisible(false);
        refreshUserList();
        addForm.resetFields();
      }
    });
  };

  const onUpdateUser = () => {
    updateForm.validateFields().then(async () => {
      const data = updateForm.getFieldsValue();
      const res = await axios.patch(`${apiPrefix}/users/${editId}`, data);
      if (res) {
        setUpdateVisible(false);
        refreshUserList();
        updateForm.resetFields();
      }
    });
  };

  const onDeleteUser = async (id: number) => {
    const res = await axios.delete(`${apiPrefix}/users/${id}`);
    if (res) {
      refreshUserList();
    }
  };

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
      filters: regionFilters,
      onFilter(value, record) {
        return record.region === value;
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
      render(value, record) {
        return (
          <Switch
            checked={value}
            onChange={async checked => {
              const res = await axios.patch(`${apiPrefix}/users/${record.id}`, {
                roleState: checked,
              });
              if (res) {
                refreshUserList();
              }
            }}
            disabled={record.default}
          />
        );
      },
    },
    {
      title: '操作',
      render(value, record, index) {
        return (
          <Space>
            <Popconfirm
              title="删除用户"
              description="你确定要删除该用户吗？"
              onConfirm={() => {
                onDeleteUser(record.id);
              }}
            >
              <Button
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                disabled={record.default}
              ></Button>
            </Popconfirm>
            <Button
              type="primary"
              icon={<EditOutlined />}
              shape="circle"
              disabled={record.default}
              onClick={() => {
                setEditId(record.id);
                setUpdateVisible(true);
              }}
            ></Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Button
        style={{ marginBottom: 20 }}
        type="primary"
        onClick={() => {
          setAddVisible(true);
        }}
      >
        添加用户
      </Button>
      <Table
        columns={columns}
        dataSource={userList}
        pagination={{ pageSize: 5 }}
        rowKey={'id'}
      />

      <Modal
        title="添加用户"
        open={addVisible}
        onCancel={() => {
          setAddVisible(false);
        }}
        onOk={onAddUser}
      >
        <UserForm
          form={addForm}
          regionOptions={regionList}
          roleOptions={roleOptions}
        />
      </Modal>

      <Modal
        title="更新用户"
        open={updateVisible}
        onCancel={() => {
          setUpdateVisible(false);
        }}
        onOk={onUpdateUser}
        afterOpenChange={open => {
          if (open) {
            const userInfo = userList.find(
              (item: { id: number }) => item.id === editId,
            );
            updateForm.setFieldsValue(userInfo);
          }
        }}
      >
        <UserForm
          form={updateForm}
          regionOptions={regionList}
          roleOptions={roleOptions}
        />
      </Modal>
    </div>
  );
};

export default UserList;
