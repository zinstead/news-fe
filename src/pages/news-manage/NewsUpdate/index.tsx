import {
  Button,
  Form,
  Input,
  message,
  notification,
  Select,
  Space,
  Steps,
} from "antd";
import { useState } from "react";
import styles from "./index.module.less";
import { useForm } from "antd/es/form/Form";
import { useRequest } from "ahooks";
import axios from "axios";
import NewsEditor from "@/components/news-manage/NewsEditor";
import { AuditState } from "@/constant";
import { Link, useNavigate, useParams } from "react-router-dom";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { convertFromHTML } from 'draft-convert';

const NewsUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [form] = useForm();
  const [editorContent, setEditorContent] = useState<EditorState>(EditorState.createEmpty());

  useRequest(async () => {
    const res = await axios.get(`/news/${id}?_expand=category&_expand=role`);
    if (res) {
      const { title, categoryId, content } = res.data;
      form.setFieldsValue({ title, categoryId });
      const initContent = EditorState.createWithContent(convertFromHTML(content as string));
      setEditorContent(initContent);
      return res.data;
    }
  });

  const { data: categoryList = [] } = useRequest(async () => {
    const res = await axios.get("/categories");
    if (res) {
      return res.data;
    }
  });

  const setContent = (content: EditorState) => {
    setEditorContent(content);
  };

  const handleSave = async (auditState: AuditState) => {
    const formData = form.getFieldsValue();
    const content = editorContent
      ? draftToHtml(convertToRaw(editorContent.getCurrentContent()))
      : "";
    const res = await axios.patch(`/news/${id}`, {
      ...formData,
      content,
      auditState: auditState,
    });
    if (res) {
      const path =
        auditState === AuditState.Unaudited
          ? "/news-manage/draft"
          : "/audit-manage/list";
      const msg =
        auditState === AuditState.Unaudited
          ? "保存成功！你可以到草稿箱中查看。"
          : "提交成功！你可以到审核列表中查看。";
      navigate(path);
      notification.success({
        description: msg,
        message: "通知",
        placement: "bottomRight",
      });
    }
  };

  const steps = [
    {
      title: "基本信息",
      subtitle: "新闻标题，新闻分类",
      content: (
        <Form form={form}>
          <Form.Item
            name={"title"}
            label="新闻标题"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"categoryId"}
            label="新闻分类"
            rules={[{ required: true }]}
          >
            <Select
              options={categoryList.map(
                (item: { label: string; id: number }) => ({
                  label: item.label,
                  value: item.id,
                })
              )}
            ></Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "新闻内容",
      subtitle: "新闻主体内容",
      content: <NewsEditor content={editorContent} setContent={setContent} />,
    },
    {
      title: "新闻提交",
      subtitle: "保存草稿或者提交审核",
      content: null,
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    description: item.subtitle,
  }));

  return (
    <div>
      <Space size={16}>
        <Link
          to={""}
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeftOutlined style={{ fontSize: 24 }} />
        </Link>
        <h2>更新新闻</h2>
      </Space>
      <Steps items={items} current={current} />
      <div style={{ margin: "40px 0" }}>
        {steps.map((item, i) => (
          <div className={current !== i ? styles.hidden : ""}>
            {item.content}
          </div>
        ))}
      </div>
      {current === 2 && (
        <>
          <Button
            type="primary"
            onClick={() => {
              handleSave(AuditState.Unaudited);
            }}
          >
            保存草稿箱
          </Button>
          <Button
            variant="outlined"
            color="danger"
            onClick={() => {
              handleSave(AuditState.Auditing);
            }}
          >
            提交审核
          </Button>
        </>
      )}
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
            if (current === 0) {
              try {
                await form.validateFields();
                setCurrent(current + 1);
              } catch (error) { }
            } else {
              if (!editorContent?.getCurrentContent().getPlainText()) {
                message.error("新闻内容不能为空！");
                return;
              }
              setCurrent(current + 1);
            }
          }}
        >
          下一步
        </Button>
      )}
    </div>
  );
};

export default NewsUpdate;
