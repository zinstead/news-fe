import { AuditState, PublishState, RoleType } from "@/constant";
import { getUserToken } from "@/utils";
import { useRequest } from "ahooks";
import { Button, notification, Space, Table, TableProps, Tag } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

interface DataType {
  id: number;
  title: string;
  author: string;
  category: { id: number; label: string; value: string };
}

const NewsAudit = () => {
  const { username, role, region } = getUserToken();

  const { data: auditList, refresh: refreshAuditList } = useRequest(
    async () => {
      const res = await axios.get(`/news?_expand=category`, {
        params: {
          auditState: AuditState.Auditing,
          publishState: PublishState.Unpublished,
        },
      });
      if (res) {
        let auditList;
        if (role.roleType === RoleType.SuperAdmin) {
          auditList = res.data;
        } else {
          auditList = res.data.filter(
            (item: any) =>
              item.author === username ||
              (item.roleId === RoleType.Editor && item.region === region)
          );
        }
        return auditList;
      }
    }
  );

  const handleAudit = async (
    id: number,
    auditState: AuditState,
    publishState: PublishState
  ) => {
    const res = await axios.patch(`/news/${id}`, { auditState, publishState });
    if (res) {
      refreshAuditList();
      notification.success({
        description: "审核成功！已经发送邮件给区域编辑。",
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
      title: "操作",
      render(value, record, index) {
        return (
          <Space>
            <Button
              onClick={() => {
                handleAudit(
                  record.id,
                  AuditState.Passed,
                  PublishState.Publishing
                );
              }}
              type="primary"
            >
              通过
            </Button>
            <Button
              danger
              onClick={() => {
                handleAudit(
                  record.id,
                  AuditState.Failed,
                  PublishState.Unpublished
                );
              }}
            >
              驳回
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Table rowKey={"id"} dataSource={auditList} columns={columns} />
    </div>
  );
};

export default NewsAudit;
