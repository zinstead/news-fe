import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiPrefix } from '@/api';

const Login = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      await form.validateFields();
      const { username, password } = form.getFieldsValue();
      const res = await axios.get(`${apiPrefix}/users?_expand=role`, {
        params: { username, password, roleState: true },
      });
      if (res.data.length === 0) {
        message.error('用户名或密码不正确');
      } else {
        localStorage.setItem('token', JSON.stringify(res.data[0]));
        form.resetFields();
        navigate('/home');
      }
    } catch (error) {
      message.error('校验失败');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.title}>全球新闻发布管理系统</div>
        <Form form={form}>
          <Form.Item name={'username'} rules={[{ required: true }]}>
            <Input placeholder="Username" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name={'password'} rules={[{ required: true }]}>
            <Input.Password placeholder="Password" prefix={<LockOutlined />} />
          </Form.Item>
        </Form>
        <div className={styles.loginBtn}>
          <Button type="primary" onClick={onLogin}>
            登录
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
