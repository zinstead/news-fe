import { Button, Table, TableProps } from "antd";
import React from "react";
import { Link } from "react-router-dom";

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

const NewsPublish = (props: {
  data: DataType[];
  renderButton: (id: number) => React.JSX.Element;
}) => {
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
        return props.renderButton(record.id);
      },
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={props.data} rowKey={"id"} />
    </div>
  );
};

export default NewsPublish;
