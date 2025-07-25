import { RoleType } from '@/constant';
import { Form, FormInstance, Input, Select } from 'antd';

const UserForm = (props: {
  regionOptions: { label: string; value: string }[];
  roleOptions: { label: string; value: string }[];
  form: FormInstance;
}) => {
  const { regionOptions, roleOptions, form } = props;
  const roleId = Form.useWatch('roleId', form);
  const disabled = roleId === RoleType['超级管理员'];

  return (
    <div>
      <Form layout="vertical" form={form}>
        <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="区域"
          name="region"
          rules={disabled ? [] : [{ required: true }]}
        >
          <Select disabled={disabled} options={regionOptions}></Select>
        </Form.Item>
        <Form.Item label="角色" name="roleId" rules={[{ required: true }]}>
          <Select
            options={roleOptions}
            onChange={value => {
              if (value === RoleType['超级管理员']) {
                form.setFieldValue('region', '');
              }
            }}
          ></Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserForm;
