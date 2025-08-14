import NewsPublish from "@/components/publish-manage/NewsPublish";
import { PublishState } from "@/constant";
import usePublish from "@/hooks/usePublish";
import { Button } from "antd";

const Publishing = () => {
  const { data, handlePublish } = usePublish(PublishState.Publishing);

  return (
    <div>
      <NewsPublish
        data={data}
        renderButton={(id) => (
          <Button
            type="primary"
            onClick={() => {
              handlePublish(id);
            }}
          >
            发布
          </Button>
        )}
      />
    </div>
  );
};

export default Publishing;
