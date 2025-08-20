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
import { Avatar, Card, Col, Drawer, List, Row, Space } from "antd";
import Meta from "antd/es/card/Meta";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as echarts from "echarts";
import { groupBy } from "lodash";
import { NewsInfo } from "@/types";

interface NewsItem {
  id: number;
  title: string;
}

const Home = () => {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const pieRef = useRef<HTMLDivElement>(null);
  const pieChart = useRef<echarts.ECharts | null>(null);

  const { data: viewList } = useRequest(async () => {
    const res = await axios.get(
      `/news?publishState=${PublishState.Published}&_expand=category&_sort=view&_order=desc&_limit=10`
    );
    if (res) {
      return res.data as NewsItem[];
    }
  });

  const { data: starList } = useRequest(async () => {
    const res = await axios.get(
      `/news?publishState=${PublishState.Published}&_expand=category&_sort=star&_order=desc&_limit=10`
    );
    if (res) {
      return res.data as NewsItem[];
    }
  });

  const { username, region, role } = getUserToken();

  const { data: newsList = [] } = useRequest(async () => {
    const res = await axios.get(`/news?publishState=2&_expand=category`);
    if (res) {
      const data = groupBy(res.data, (item) => item.category.value);
      renderBar(data);
      return res.data as NewsInfo[];
    }
  });

  const renderBar = (
    data: Record<string, { value: string; label: string }[]>
  ) => {
    if (barRef.current) {
      var myChart = echarts.init(barRef.current);

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
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
        yAxis: {
          minInterval: 1,
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

      window.onresize = () => {
        myChart.resize();
      };
    }
  };

  const renderPie = () => {
    if (pieRef.current) {
      if (!pieChart.current) {
        pieChart.current = echarts.init(pieRef.current);
      }
      var option;
      const myNews = groupBy(
        newsList.filter((item) => item.author === username),
        (item) => item.category.value
      );
      const pieData = Object.keys(myNews).map((key) => ({
        name: key,
        value: myNews[key].length,
      }));

      option = {
        title: {
          text: "当前用户新闻分类图示",
          // subtext: "Fake Data",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "发布数量",
            type: "pie",
            radius: "50%",
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && pieChart.current.setOption(option);
    }
  };

  useEffect(() => {
    return () => {
      window.onresize = null;
    };
  }, []);

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
              dataSource={viewList}
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
              dataSource={starList}
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
              <SettingOutlined
                key="setting"
                onClick={() => {
                  setVisible(true);
                  // renderPie();
                }}
              />,
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
      <div ref={barRef} style={{ height: 400, marginTop: 30 }}></div>
      <Drawer
        title="个人新闻分类"
        open={visible}
        onClose={() => {
          setVisible(false);
        }}
        closable
        afterOpenChange={(open) => {
          if (open) {
            renderPie();
          }
        }}
        width={500}
      >
        <div ref={pieRef} style={{ height: 400 }}></div>
      </Drawer>
    </div>
  );
};

export default Home;
