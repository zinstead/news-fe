import { ConvertedNode, MenuItem, RightItem, TreeNode } from '@/types';
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

export const convertLabelToTitle = (data:TreeNode[]):ConvertedNode[] => data.map(({ label, children, ...rest }) => ({
  ...rest,
  title: label,
  ...(children ? { children: convertLabelToTitle(children) } : null)
}));

export const getUserToken=()=>{
  return JSON.parse(localStorage.getItem('token') ?? `{}`);
}
