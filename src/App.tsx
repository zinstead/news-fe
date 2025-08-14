import { Navigate, Outlet, useRoutes } from "react-router-dom";
import "./App.css";
import NewsSandbox from "@/pages/NewsSandbox";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/404";
import RightList from "@/pages/right-manage/RightList";
import RoleList from "@/pages/right-manage//RoleList";
import UserList from "@/pages/user-manage/UserList";
import NewsAdd from "@/pages/news-manage/NewsAdd";
import NewsDraft from "@/pages/news-manage/NewsDraft";
import NewsPreview from "@/pages/news-manage/NewsPreview";
import NewsUpdate from "@/pages/news-manage/NewsUpdate";
import AuditList from "@/pages/audit-manage/AuditList";
import Published from "@/pages/publish-manage/Published";
import NewsAudit from "@/pages/audit-manage/NewsAudit";
import NewsCategory from "@/pages/news-manage/NewsCategory";
import Publishing from "@/pages/publish-manage/Publishing";
import Sunset from "@/pages/publish-manage/Sunset";

const App = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <NewsSandbox />,
      children: [
        {
          index: true,
          element: <Navigate to={"/home"} />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "right-manage",
          element: <Outlet />,
          children: [
            {
              path: "right",
              element: <Outlet />,
              children: [
                {
                  path: "list",
                  element: <RightList />,
                },
              ],
            },
            {
              path: "role",
              element: <Outlet />,
              children: [
                {
                  path: "list",
                  element: <RoleList />,
                },
              ],
            },
          ],
        },
        {
          path: "user-manage",
          element: <Outlet />,
          children: [
            {
              path: "list",
              element: <UserList />,
            },
          ],
        },
        {
          path: "news-manage",
          element: <Outlet />,
          children: [
            {
              path: "add",
              element: <NewsAdd />,
            },
            {
              path: "draft",
              element: <NewsDraft />,
            },
            {
              path: "preview/:id",
              element: <NewsPreview />,
            },
            {
              path: "update/:id",
              element: <NewsUpdate />,
            },
            {
              path: "category",
              element: <NewsCategory />,
            },
          ],
        },
        {
          path: "audit-manage",
          element: <Outlet />,
          children: [
            {
              path: "list",
              element: <AuditList />,
            },
            {
              path: "audit",
              element: <NewsAudit />,
            },
          ],
        },
        {
          path: "publish-manage",
          element: <Outlet />,
          children: [
            {
              path: "published",
              element: <Published />,
            },
            {
              path: "unpublished",
              element: <Publishing />,
            },
            {
              path: "sunset",
              element: <Sunset />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <div style={{ height: "100vh" }}>{routes}</div>;
};

export default App;
