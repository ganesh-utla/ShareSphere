import { Loader, PostCard, UserCard } from "@/components/shared";
import { useUserContext } from "@/context/AuthContext";
import { useGetAllUsers, useGetRecentPosts } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {

  const { data: posts, isPending: isPostsLoading, isError: isPostsError, fetchNextPage, hasNextPage } = useGetRecentPosts();
  const { data: creators, isLoading: isUserLoading, isError: isErrorCreators, } = useGetAllUsers();
  const { user: currentUser } = useUserContext();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  if (isPostsError || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Home Feed
          </h2>
          {isPostsLoading && !posts? (
            <Loader />
          ) : (
            <ul className="flex flex-col gap-9 w-full">
              {posts?.pages.map((docs) => (
                docs?.documents.map((post) => (
                  <li key={post.$id} className="flex justify-center w-full">
                    <PostCard post={post} />
                  </li>
                ))
              ))}
              { hasNextPage && (
                <div ref={ref} className="flex justify-center mt-4">
                  <Loader />
                </div>
              )}
            </ul>    
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold">Suggested Users</h3>
        {isUserLoading && !creators ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.pages.map((docs) => (
              docs?.documents.filter(creator => creator.$id !== currentUser.id).map((creator) => (
                <li key={creator?.$id}>
                  <UserCard user={creator} />
                </li>
            ))))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Home