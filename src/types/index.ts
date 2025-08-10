import { AuditState, PublishState, RoleType } from "@/constant";
import { EditorState } from "react-draft-wysiwyg";

export interface MenuItem {
  key: string;
  label: string;
  children: MenuItem[];
  pagePermission: number;
}

export interface RightItem {
  id: string;
  key: string;
  label: string;
  children: RightItem[];
}

export interface TreeNode {
  label: string;
  children?: TreeNode[];
  [key: string]: any;
}

export interface ConvertedNode {
  title: string;
  children?: ConvertedNode[];
  [key: string]: any;
}

export interface NewsInfo {
  title: string;
  categoryId: number;
  content: EditorState;
  region: string;
  author: string;
  roleId: RoleType;
  auditState: AuditState;
  publishState: PublishState;
  createTime: number;
  publishTime: number;
  star: number;
  view: number;
  category: {
    id: number;
    label: string;
    value: string;
  };
  role: {
    id: number;
    rights: string[];
    roleName: string;
    roleType: RoleType;
  };
}
