import { Button, Form, Input, Select, StepProps, Steps } from 'antd';
import { useState } from 'react';
import styles from './index.module.less';
import { useForm } from 'antd/es/form/Form';
import { useRequest } from 'ahooks';
import axios from 'axios';
import NewsEditor from '@/components/news-manage/NewsEditor';

const NewsAdd = () => {
  const [current, setCurrent] = useState(0);
  const [form] = useForm();

  const { data: categoryList = [] } = useRequest(async () => {
    const res = await axios.get('/categories');
    if (res) {
      return res.data
    }
  })

  const steps = [
    {
      title: '基本信息',
      subtitle: '新闻标题，新闻分类',
      content: <Form form={form}>
        <Form.Item name={'title'} label='新闻标题' rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name={'categoryId'} label='新闻分类' rules={[{ required: true }]} >
          <Select options={categoryList}></Select></Form.Item>
      </Form>,
    },
    {
      title: '新闻内容',
      subtitle: '新闻主体内容',
      content: <NewsEditor />,
    },
    {
      title: '新闻提交',
      subtitle: '保存草稿或者提交审核',
      content: <Input />,
    },
  ];

  const items = steps.map(item => ({
    key: item.title,
    title: item.title,
    description: item.subtitle,
  }));

  return (
    <div>
      <h2>撰写新闻</h2>
      <Steps items={items} current={current} />
      <div style={{ margin: '40px 0' }}>
        {steps.map((item, i) => (
          <div className={current !== i ? styles.hidden : ''}>{item.content}</div>
        ))}
      </div>
      {current > 0 && (
        <Button
          onClick={() => {
            setCurrent(current - 1);
          }}
        >
          上一步
        </Button>
      )}
      {current < 2 && (
        <Button
          type="primary"
          onClick={async () => {
            try {
              await form.validateFields();
              setCurrent(current + 1);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          下一步
        </Button>
      )}
    </div>
  );
};

export default NewsAdd;
