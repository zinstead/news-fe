import { AuditState } from '@/constant';
import { getUserToken } from '@/utils';
import {
  DeleteOutlined,
  EditOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Popconfirm, Space, Table, TableProps } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface DataType {
  id: number;
  title: string;
  author: string;
  category: {
    id: number;
    label: string;
    value: string;
  };
}

const NewsDraft = () => {
  const { username } = getUserToken();
  const { data: newsList = [],refresh:refreshNewsList } = useRequest(async () => {
    const res = await axios.get(`/news?_expand=category`, {
      params: { author: username, auditState: AuditState.Unaudited },
    });
    if (res) {
      return res.data;
    }
  });

  const handleDelete=async(id:number)=>{
    const res=await axios.delete(`/news/${id}`);
    if(res){
      refreshNewsList();
    }
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      dataIndex: 'id',
      title: 'ID',
      render: value => {
        return <b>{value}</b>;
      },
    },
    {
      dataIndex: 'title',
      title: '标题',
      render: (value, record, index) => {
        return <Link to={`/news-manage/preview/${record.id}`}>{value}</Link>;
      },
    },
    {
      dataIndex: 'author',
      title: '作者',
      render(value, record, index) {
        return value;
      },
    },
    {
      dataIndex: 'category',
      title: '新闻分类',
      render(value, record, index) {
        return value.label;
      },
    },
    {
      dataIndex: 'operator',
      title: '操作',
      render: (value, record, index) => {
        return (
          <Space>
            <Popconfirm title="" description="你确定要删除吗？" onConfirm={()=>{
              handleDelete(record.id);
            }}>
              <Button danger shape="circle" icon={<DeleteOutlined />}></Button>
            </Popconfirm>
            <Popconfirm title="" description="">
              <Button shape="circle" icon={<EditOutlined />}></Button>
            </Popconfirm>
            <Popconfirm title="" description="">
              <Button
                type="primary"
                shape="circle"
                icon={<VerticalAlignTopOutlined />}
              ></Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Table rowKey={'id'} columns={columns} dataSource={newsList} />
    </div>
  );
};

export default NewsDraft;
