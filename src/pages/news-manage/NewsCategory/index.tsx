import { DeleteOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import {
  Button,
  Form,
  GetRef,
  Input,
  InputRef,
  message,
  Popconfirm,
  Table,
  TableProps,
} from "antd";
import axios from "axios";
import React from "react";
import { useContext, useEffect, useRef, useState } from "react";

type FormInstance<T> = GetRef<typeof Form<T>>;
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof DataType;
  record: DataType;
  handleSave: (record: DataType) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      //   console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

interface DataType {
  id: number;
  label: string;
  value: string;
}

const NewsCategory = () => {
  const { data: categoryList, refresh: refreshCategoryList } = useRequest(
    async () => {
      const res = await axios.get(`/categories`);
      if (res) {
        return res.data;
      }
    }
  );

  const handleDelete = async (id: number) => {
    const res = await axios.delete(`/categories/${id}`);
    if (res) {
      refreshCategoryList();
      message.success("删除成功");
    }
  };

  const handleSave = async (record: DataType) => {
    const res = await axios.patch(`/categories/${record.id}`, {
      label: record.label,
      value: record.label,
    });
    if (res) {
      refreshCategoryList();
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      dataIndex: "id",
      title: "ID",
    },
    {
      dataIndex: "label",
      title: "栏目名称",
      onCell: (record: DataType) => ({
        record,
        editable: true,
        dataIndex: "label",
        title: "栏目名称",
        handleSave,
      }),
    },
    {
      title: "操作",
      render(value, record, index) {
        return (
          <Popconfirm
            title="你确定要删除吗？"
            onConfirm={() => {
              handleDelete(record.id);
            }}
          >
            <Button danger shape="circle">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        components={components}
        rowKey={"id"}
        dataSource={categoryList}
        columns={columns}
      />
    </div>
  );
};

export default NewsCategory;
