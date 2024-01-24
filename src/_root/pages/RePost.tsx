import { Loader } from "@/components/shared";
import { PostForm } from "@/components/forms";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const RePost = () => {

  const { id } = useParams();

  const { data: post, isPending: isPostLoading, isError: isPostError } = useGetPostById(id || "");

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="w-full max-w-5xl flex-start justify-start gap-3">
          <img 
            src="/assets/icons/gallery-add.svg"
            alt="create post"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Repost
          </h2>
        </div>

        {isPostLoading || isPostError?
          <Loader /> :
          <PostForm post={post} action="Create" />
        }
      </div>
    </div>
  )
}

export default RePost