import { PublishState } from "@/constant";
import { getUserToken } from "@/utils";
import {
  BarChartOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRequest } from "ahooks";
import { Avatar, Card, Col, List, Row, Space } from "antd";
import Meta from "antd/es/card/Meta";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import * as echarts from "echarts";
import { groupBy } from "lodash";

interface NewsItem {
  id: number;
  title: string;
}

const Home = () => {
  const { data: viewList } = useRequest(async () => {
    const res = await axios.get(
      `/news?publishState=${PublishState.Published}&_expand=category&_sort=view&_order=desc&_limit=10`
    );
    if (res) {
      return res.data;
    }
  });

  const { data: starList } = useRequest(async () => {
    const res = await axios.get(
      `/news?publishState=${PublishState.Published}&_expand=category&_sort=star&_order=desc&_limit=10`
    );
    if (res) {
      return res.data;
    }
  });

  const { username, region, role } = getUserToken();

  useRequest(async () => {
    const res = await axios.get(`/news?publishState=2&_expand=category`);
    if (res) {
      const data = groupBy(res.data, (item) => item.category.value);
      renderBar(data);
    }
  });

  const renderBar = (
    data: Record<string, { value: string; label: string }[]>
  ) => {
    var myChart = echarts.init(document.getElementById("main"));

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "新闻分类图示",
      },
      tooltip: {},
      legend: {
        data: ["新闻数量"],
      },
      xAxis: {
        data: Object.keys(data),
      },
      yAxis: {
        axisTick: {
          length: 1,
        },
      },
      series: [
        {
          name: "新闻数量",
          type: "bar",
          data: Object.values(data).map((item) => item.length),
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title={
              <div>
                <span>用户最常浏览</span>
                <BarChartOutlined style={{ marginLeft: 5 }} />
              </div>
            }
            variant="outlined"
          >
            <List
              dataSource={viewList as NewsItem[]}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/news-manage/preview/${item.id}`}>
                    {item.title}
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <div>
                <span>用户点赞最多</span>
                <BarChartOutlined style={{ marginLeft: 5 }} />
              </div>
            }
            variant="outlined"
          >
            <List
              dataSource={starList as NewsItem[]}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/news-manage/preview/${item.id}`}>
                    {item.title}
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar size={64} icon={<UserOutlined />} />}
              title={username}
              description={
                <Space size={20}>
                  <div style={{ fontWeight: "bold" }}>
                    {region ? region : "全球"}
                  </div>
                  <div>{role.roleName}</div>
                </Space>
              }
            />
          </Card>
        </Col>
      </Row>
      <div id="main" style={{ height: 400 }}></div>
    </div>
  );
};

export default Home;
