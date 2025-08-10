import { useRequest } from "ahooks";
import axios from "axios";
import { keyBy } from "lodash";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Auth = (props: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { role } = JSON.parse(token ?? "{}");
  const { pathname } = useLocation();

  const { data: rightList = {} } = useRequest(async () => {
    const [res1, res2] = await Promise.all([
      axios.get(`/rights`),
      axios.get(`/children`),
    ]);
    if (res1 && res2) {
      return keyBy([...res1.data, ...res2.data], "key");
    }
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  if (!token) {
    return null;
  }

  if (pathname !== "/") {
    const path =
      pathname.includes("/news-manage/preview") ||
      pathname.includes("/news-manage/update")
        ? pathname.split("/").slice(0, -1).join("/") + "/:id"
        : pathname;
    if (
      (rightList[path]?.pagePermission !== 1 &&
        rightList[path]?.routePermission !== 1) ||
      !role?.rights.includes(path)
    ) {
      console.log(
        rightList[path]?.pagePermission !== 1 &&
          rightList[path]?.routePermission !== 1
      );
      console.log(!role?.rights.includes(path));

      return <div>403 没有权限访问</div>;
    }
  }

  return props.children;
};

export default Auth;
