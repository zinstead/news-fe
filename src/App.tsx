import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import NewsSandbox from '@/pages/NewsSandbox';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import NotFound from '@/pages/404';
import RightList from '@/pages/right-manage/RightList';
import RoleList from '@/pages/right-manage//RoleList';
import UserList from '@/pages/user-manage/UserList';
import NewsAdd from '@/pages/news-manage/NewsAdd';
import './App.css';
import NewsDraft from '@/pages/news-manage/NewsDraft';

const App = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <NewsSandbox />,
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
          path: 'news-manage',
          element: <Outlet />,
          children: [
            {
              path: 'add',
              element: <NewsAdd />,
            },
            {
              path: 'draft',
              element: <NewsDraft />,
            },
          ],
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
