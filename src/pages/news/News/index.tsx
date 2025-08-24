import PageHeader from "@/components/PageHeader";
import { useRequest } from "ahooks";
import { Card, Col, List, Row } from "antd";
import axios from "axios";
import { groupBy } from "lodash";
import { Link } from "react-router-dom";

const News = () => {
  const { data: newsList } = useRequest(async () => {
    const res = await axios.get(`/news?publishState=2&_expand=category`);
    if (res) {
      return Object.entries(groupBy(res.data, (item) => item.category.value));
    }
  });

  return (
    <div style={{ width: "95%", margin: "0 auto" }}>
      <PageHeader title={"全球大新闻"} subtitle={"查看新闻"} />
      <Row style={{ padding: 30 }} gutter={[24, 24]}>
        {newsList?.map(([key, list]) => (
          <Col span={8} key={key}>
            <Card title={key} variant="outlined" hoverable>
              <List
                pagination={{ pageSize: 3 }}
                dataSource={list}
                renderItem={(item) => (
                  <List.Item>
                    <Link to={`/news/detail/${item.id}`}>{item.title}</Link>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default News;
