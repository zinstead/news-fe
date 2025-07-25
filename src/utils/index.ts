import { MenuItem, RightItem } from '@/types';
import { isEmpty } from 'lodash';

export const getPageMenuList = (menuList: MenuItem[],rightList:string[]): any[] => {
    return menuList
      .filter(item => item.pagePermission === 1 && rightList.includes(item.key))
      .map(({ pagePermission, children, ...restItem }) => ({
        ...restItem,
        children: isEmpty(children) ? null : getPageMenuList(children,rightList) 
      }));
  };

export const getRightList=(rightList:RightItem[]):any[]=>{
  return rightList.map(({children,...restItem})=>{
    return {
      ...restItem,
      children:isEmpty(children)?null:getRightList(children)
    }
  })
}

interface TreeNode {
  label: string;
  children?: TreeNode[];
  [key: string]: any;
}

interface ConvertedNode {
  title: string;
  children?: ConvertedNode[];
  [key: string]: any;
}

export const convertLabelToTitle = (data:TreeNode[]):ConvertedNode[] => data.map(({ label, children, ...rest }) => ({
  ...rest,
  title: label,
  ...(children ? { children: convertLabelToTitle(children) } : null)
}));
