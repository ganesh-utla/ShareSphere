import { useGetUserById } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite";
import { Loader, GridPostList } from ".";

type RelatedPostsProps = {
    userId: string | undefined;
    postId: string | undefined;
}

const RelatedPosts = ({ userId, postId } : RelatedPostsProps) => {

  const { data: user } = useGetUserById(userId || "");
  const relatedPosts = user?.posts.filter((post: Models.Document) => post.$id !== postId);

  if (!user || !relatedPosts) {
    <div className="w-full flex justify-center items-center">
        <Loader />
    </div>
  }

  if (relatedPosts && relatedPosts.length==0) {
    return <></>;
  }

  return (
    <div className="w-full max-w-5xl">
        <hr className="border w-full border-light-3" />

        <h3 className="body-bold md:h3-bold w-full my-10">
            More Related Posts
        </h3>

        <GridPostList posts={relatedPosts} showUser={false} />
    </div>
  )
}

export default RelatedPosts