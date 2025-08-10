import { AuditState, PublishState } from "@/constant";
import { NewsInfo } from "@/types";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import { Descriptions, DescriptionsProps, Space } from "antd";
import axios from "axios";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";

const auditStateMap = {
  [AuditState.Unaudited]: "未审核",
  [AuditState.Auditing]: "审核中",
  [AuditState.Passed]: "已通过",
  [AuditState.Failed]: "未通过",
};

const publishStateMap = {
  [PublishState.Unpublished]: "未发布",
  [PublishState.Publishing]: "待发布",
  [PublishState.Published]: "已发布",
  [PublishState.Withdrawed]: "已下线",
};

const NewsPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: newsInfo } = useRequest(async () => {
    const res = await axios.get(`/news/${id}?_expand=category&_expand=role`);
    if (res) {
      return res.data as NewsInfo;
    }
  });

  const items: DescriptionsProps["items"] = newsInfo
    ? [
        {
          key: "1",
          label: "创建者",
          children: <span>{newsInfo.author}</span>,
        },
        {
          key: "2",
          label: "创建时间",
          children: (
            <span>
              {moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}
            </span>
          ),
        },
        {
          key: "3",
          label: "发布时间",
          children: (
            <span>
              {newsInfo.publishTime
                ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss")
                : "-"}
            </span>
          ),
        },
        {
          key: "4",
          label: "区域",
          children: <span>{newsInfo.region}</span>,
        },
        {
          key: "5",
          label: "审核状态",
          children: (
            <span style={{ color: "red" }}>
              {auditStateMap[newsInfo.auditState]}
            </span>
          ),
        },
        {
          key: "6",
          label: "发布状态",
          children: (
            <span style={{ color: "red" }}>
              {publishStateMap[newsInfo.publishState]}
            </span>
          ),
        },
        {
          key: "7",
          label: "访问数量",
          children: <span>{newsInfo.view}</span>,
        },
        {
          key: "8",
          label: "点赞数量",
          children: <span>{newsInfo.star}</span>,
        },
        {
          key: "9",
          label: "评论数量",
          children: <span>0</span>,
        },
      ]
    : [];

  return (
    <div>
      {newsInfo && (
        <div>
          <Descriptions
            title={
              <h2>
                <Space size={16} style={{ height: 36 }} align="center">
                  <Link
                    to={""}
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    <ArrowLeftOutlined />
                  </Link>
                  <span>{newsInfo.title}</span>
                  <span
                    style={{
                      color: "rgba(0, 0, 0, 0.45)",
                      fontSize: 14,
                    }}
                  >
                    {newsInfo.category.label}
                  </span>
                </Space>
              </h2>
            }
            items={items}
          />
          <div
            style={{
              border: "1px solid gray",
              margin: "24px 0",
              padding: "12px",
            }}
            dangerouslySetInnerHTML={{
              __html: newsInfo.content as any as TrustedHTML,
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default NewsPreview;
