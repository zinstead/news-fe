import PageHeader from "@/components/PageHeader";
import { NewsInfo } from "@/types";
import { HeartTwoTone } from "@ant-design/icons";
import { useRequest } from "ahooks";
import { Descriptions, DescriptionsProps, message, Space } from "antd";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";

const Detail = () => {
  const { id } = useParams();

  const { data: newsInfo, mutate } = useRequest(async () => {
    const res = await axios.get(`/news/${id}?_expand=category&_expand=role`);
    if (res) {
      // 每次查看新闻，访问量+1
      await axios.patch(`/news/${id}`, {
        view: res.data.view + 1,
      });
      return { ...res.data, view: res.data.view + 1 } as NewsInfo;
    }
  });

  const items: DescriptionsProps["items"] = newsInfo
    ? [
        {
          key: "1",
          label: "创建者",
          children: <span>{newsInfo.author}</span>,
        },
        // {
        //   key: "2",
        //   label: "创建时间",
        //   children: (
        //     <span>
        //       {moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}
        //     </span>
        //   ),
        // },
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
        // {
        //   key: "5",
        //   label: "审核状态",
        //   children: (
        //     <span style={{ color: auditStateColorMap[newsInfo.auditState] }}>
        //       {auditStateMap[newsInfo.auditState]}
        //     </span>
        //   ),
        // },
        // {
        //   key: "6",
        //   label: "发布状态",
        //   children: (
        //     <span
        //       style={{ color: publishStateColorMap[newsInfo.publishState] }}
        //     >
        //       {publishStateMap[newsInfo.publishState]}
        //     </span>
        //   ),
        // },
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

  const handleStar = async () => {
    if (newsInfo) {
      await axios.patch(`/news/${id}`, {
        star: newsInfo.star + 1,
      });
      mutate({ ...newsInfo, star: newsInfo.star + 1 });
      message.success("点赞成功！");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      {newsInfo && (
        <div>
          <Descriptions
            title={
              <PageHeader
                title={newsInfo.title}
                subtitle={
                  <Space>
                    <span>{newsInfo.category.label}</span>{" "}
                    <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar} />
                  </Space>
                }
                backIcon
                style={{ padding: 0 }}
              />
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
              __html: newsInfo.content as any as string,
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Detail;
