import NewsPublish from "@/components/publish-manage/NewsPublish";
import { PublishState } from "@/constant";
import usePublish from "@/hooks/usePublish";
import { Button } from "antd";

const Sunset = () => {
  const { data, handleDelete } = usePublish(PublishState.Withdrawed);

  return (
    <div>
      <NewsPublish
        data={data}
        renderButton={(id) => (
          <Button
            danger
            onClick={() => {
              handleDelete(id);
            }}
          >
            删除
          </Button>
        )}
      />
    </div>
  );
};

export default Sunset;
