import { ArrowLeftOutlined } from "@ant-design/icons";
import { Space } from "antd";
import React from "react";
import styles from "./index.module.less";
import { useNavigate } from "react-router-dom";

const PageHeader = (props: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  backIcon?: React.ReactNode | boolean;
  onBack?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { title, subtitle, extra, backIcon, onBack, className, style } = props;
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={className}
      style={{
        padding: 30,
        display: "flex",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <Space size={16}>
        {backIcon ? (
          <div className={styles.backIcon} onClick={handleBack}>
            {backIcon === true ? <ArrowLeftOutlined /> : backIcon}
          </div>
        ) : null}
        <h2 style={{ margin: 0 }}>{title}</h2>
        <div style={{ color: "gray" }}>{subtitle}</div>
      </Space>
      <div>{extra}</div>
    </div>
  );
};

export default PageHeader;
