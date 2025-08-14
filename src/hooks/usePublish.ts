import { PublishState } from "@/constant";
import { getUserToken } from "@/utils";
import { useRequest } from "ahooks";
import { notification } from "antd";
import axios from "axios";

const usePublish = (publishState: PublishState) => {
  const { username } = getUserToken();

  const { data, refresh } = useRequest(async () => {
    const res = await axios.get(`/news?_expand=category`, {
      params: { author: username, publishState },
    });
    if (res) {
      return res.data;
    }
  });

  const handlePublish = async (id: number) => {
    const res = await axios.patch(`/news/${id}`, {
      publishState: PublishState.Published,
      publishTime: Date.now(),
    });
    if (res) {
      refresh();
      notification.success({
        description: "发布成功！你可以到【发布管理/已发布】中查看。",
        message: "通知",
        placement: "bottomRight",
      });
    }
  };

  const handleSunset = async (id: number) => {
    const res = await axios.patch(`/news/${id}`, {
      publishState: PublishState.Withdrawed,
    });
    if (res) {
      refresh();
      notification.success({
        description: "下线成功！你可以到【发布管理/已下线】中查看。",
        message: "通知",
        placement: "bottomRight",
      });
    }
  };

  const handleDelete = async (id: number) => {
    const res = await axios.delete(`/news/${id}`);
    if (res) {
      refresh();
      notification.success({
        description: "删除成功！",
        message: "通知",
        placement: "bottomRight",
      });
    }
  };

  return { data, handlePublish, handleSunset, handleDelete };
};

export default usePublish;
