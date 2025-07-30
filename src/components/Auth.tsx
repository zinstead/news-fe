import { useRequest } from 'ahooks';
import axios from 'axios';
import { keyBy } from 'lodash';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Auth = (props: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { role } = JSON.parse(token ?? '{}');
  const { pathname } = useLocation();

  const { data: rightList = {} } = useRequest(async () => {
    const [res1, res2] = await Promise.all([
      axios.get(`/rights`),
      axios.get(`/children`),
    ]);
    if (res1 && res2) {
      return keyBy([...res1.data, ...res2.data], 'key');
    }
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, []);

  if (!token) {
    return null;
  } else if (
    pathname !== '/' &&
    (rightList[pathname]?.pagePermission !== 1 ||
      !role?.rights.includes(pathname))
  ) {
    return <div>403 没有权限访问</div>;
  }

  return props.children;
};

export default Auth;
