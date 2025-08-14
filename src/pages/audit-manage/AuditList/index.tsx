import {
  AuditState,
  auditStateColorMap,
  auditStateMap,
  PublishState,
} from "@/constant";
import { getUserToken } from "@/utils";
import { useRequest } from "ahooks";
import { Button, notification, Table, TableProps, Tag } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface DataType {
  id: number;
  title: string;
  author: string;
  category: { id: number; label: string; value: string };
  auditState: AuditState;
}

const AuditList = () => {
  const { username } = getUserToken();
  const navigate = useNavigate();

  const { data: auditList, refresh: refreshAuditList } = useRequest(
    async () => {
      const res = await axios.get(
        `/news?author=${username}&auditState_ne=${AuditState.Unaudited}&publishState_lte=${PublishState.Publishing}&_expand=category`
      );
      if (res) {
        return res.data;
      }
    }
  );

  const handleRevoke = async (id: number) => {
    const res = await axios.patch(`/news/${id}`, {
      auditState: AuditState.Unaudited,
    });
    if (res) {
      refreshAuditList();
      notification.success({
        description: "撤销成功！你可以到草稿箱中查看。",
        message: "通知",
        placement: "bottomRight",
      });
    }
  };

  const handleModify = (id: number) => {
    navigate(`/news-manage/update/${id}`);
  };

  const handlePublish = async (id: number) => {
    const res = await axios.patch(`/news/${id}`, {
      publishState: PublishState.Published,
      publishTime: Date.now(),
    });
    if (res) {
      refreshAuditList();
      notification.success({
        description: "发布成功！你可以到发布管理模块中查看。",
        message: "通知",
        placement: "bottomRight",
      });
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      dataIndex: "title",
      title: "标题",
      render(value, record, index) {
        return <Link to={`/news-manage/preview/${record.id}`}>{value}</Link>;
      },
    },
    {
      dataIndex: "author",
      title: "作者",
    },
    {
      dataIndex: "category",
      title: "新闻分类",
      render(value, record, index) {
        return value.label;
      },
    },
    {
      dataIndex: "auditState",
      title: "审核状态",
      render(value, record, index) {
        return (
          <Tag color={auditStateColorMap[value as AuditState]}>
            {auditStateMap[value as AuditState]}
          </Tag>
        );
      },
    },
    {
      title: "操作",
      render(value, record, index) {
        if (record.auditState === AuditState.Auditing) {
          return (
            <Button
              onClick={() => {
                handleRevoke(record.id);
              }}
            >
              撤销
            </Button>
          );
        } else if (record.auditState === AuditState.Passed) {
          return (
            <Button
              onClick={() => {
                handlePublish(record.id);
              }}
              danger
            >
              发布
            </Button>
          );
        } else if (record.auditState === AuditState.Failed) {
          return (
            <Button
              onClick={() => {
                handleModify(record.id);
              }}
              type="primary"
            >
              修改
            </Button>
          );
        }
      },
    },
  ];

  return (
    <div>
      <Table rowKey={"id"} dataSource={auditList} columns={columns} />
    </div>
  );
};

export default AuditList;
