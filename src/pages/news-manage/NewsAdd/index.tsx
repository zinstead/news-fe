import { Button, Input, StepProps, Steps } from 'antd';
import { useState } from 'react';
import styles from './index.module.less';

const steps = [
  {
    title: '基本信息',
    subtitle: '新闻标题，新闻分类',
    content: <Input />,
  },
  {
    title: '新闻内容',
    subtitle: '新闻主体内容',
    content: <Input />,
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

const NewsAdd = () => {
  const [current, setCurrent] = useState(0);

  return (
    <div>
      <h2>撰写新闻</h2>
      <Steps items={items} current={current} />
      {steps.map((item, i) => (
        <div className={current !== i ? styles.hidden : ''}>{item.content}</div>
      ))}
      {current > 0 && (
        <Button
          type="primary"
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
          onClick={() => {
            setCurrent(current + 1);
          }}
        >
          下一步
        </Button>
      )}
    </div>
  );
};

export default NewsAdd;
