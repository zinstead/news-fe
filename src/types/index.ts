export interface MenuItem{
    key:string;
    label:string;
    children:MenuItem[]
    pagePermission:number;
}

export interface RightItem{
    id:string;
    key:string;
    label:string;
    children:RightItem[]
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