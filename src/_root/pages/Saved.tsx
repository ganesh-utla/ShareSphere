import { GridPostList } from "@/components/shared";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite";

const Saved = () => {

  const { data: user } = useGetCurrentUser();

  const savedPosts = user?.save.map((savedPost: Models.Document) => ({
    ...savedPost.post,
    creator: {
      imageUrl: user.imageUrl
    }
  })).reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl items-center">
        <img 
          src="/assets/icons/save.svg"
          alt="save-icon"
          className="w-8 h-8"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">
          Saved Posts
        </h2>
      </div>

      <div className="">
        <GridPostList posts={savedPosts} showStats={false} showUser={false} />
      </div>
    </div>
  )
}

export default Saved