import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import NewsSandbox from '@/pages/NewsSandbox';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import NotFound from '@/pages/404';
import RightList from '@/pages/right-manage/RightList';
import RoleList from '@/pages/right-manage//RoleList';
import UserList from '@/pages/user-manage/UserList';
import './App.css';
import Auth from '@/components/Auth';

const App = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: (
        <Auth>
          <NewsSandbox />
        </Auth>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={'/home'} />,
        },
        {
          path: 'home',
          element: <Home />,
        },
        {
          path: 'right-manage',
          element: <Outlet />,
          children: [
            {
              path: 'right',
              element: <Outlet />,
              children: [
                {
                  path: 'list',
                  element: <RightList />,
                },
              ],
            },
            {
              path: 'role',
              element: <Outlet />,
              children: [
                {
                  path: 'list',
                  element: <RoleList />,
                },
              ],
            },
          ],
        },
        {
          path: 'user-manage',
          element: <Outlet />,
          children: [
            {
              path: 'list',
              element: <UserList />,
            },
          ],
        },
        {
          path: '*',
          element: <div>未匹配页面</div>,
        },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return <div style={{ height: '100vh' }}>{routes}</div>;
};

export default App;
