import { Loader, GridPostList } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useFollowUser, useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { LikedPosts } from ".";
import { useEffect, useState } from "react";
import { checkIsFollowed } from "@/lib/utils";

const StatBlock = ({value, label} : {value: number, label: string}) => {
  return (
    <div className="flex-center gap-2">
      <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
      <p className="small-medium lg:base-medium text-dark-4">{label}</p>
    </div>
  )
}

const Profile = () => {

  const { id } = useParams();
  const { data: user } = useGetUserById(id || "");
  const { user: currentUser } = useUserContext();
  const { pathname } = useLocation();
  const { mutateAsync: followUser } = useFollowUser();
  
  const [followers, setFollowers] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setFollowers(user.followers);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="w-full h-full flex-center">
        <Loader />
      </div>
    )
  }

  const handleFollow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    let newFollowers = [...followers];
    if (newFollowers.includes(currentUser.id)) {
        newFollowers = newFollowers.filter(id => id!==currentUser.id);
    } else {
        newFollowers.push(currentUser.id);
    }
    setFollowers(newFollowers);
    followUser({ userId: id || "", followersArray: newFollowers });
  }

  return (
    <div className="profile-container">
      <div className="profile-inner_container border-white">
        <div className="flex md:flex-row flex-col max-md:items-center flex-1 gap-7">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="user-image"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {user.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{user.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={user.posts.length} label={"Posts"} />
              <StatBlock value={followers.length} label={"Followers"} />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div>
            {currentUser.id!==id? (
              <Button 
                type="button" 
                className={`shad-button_primary px-8 ${checkIsFollowed(followers, currentUser.id) && '!bg-dark-4 hover:!bg-dark-4'}`} 
                onClick={(e) => handleFollow(e)}
              >
                {checkIsFollowed(followers, currentUser.id)? "Unfollow" : "Follow"}
              </Button>
            ) : (
              <Link
                to={`/update-profile/${id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  currentUser.id !== id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            )}
          </div>
        </div>

        {currentUser.id===id? (
          <div className="flex max-w-5xl w-full">
            <Link
              to={`/profile/${id}`}
              className={`profile-tab rounded-l-lg ${
                pathname === `/profile/${id}` && "!bg-light-7"
              }`}>
              <img
                src={"/assets/icons/posts.svg"}
                alt="posts"
                width={20}
                height={20}
              />
              Posts
            </Link>
            <Link
              to={`/profile/${id}/liked-posts`}
              className={`profile-tab rounded-r-lg ${
                pathname === `/profile/${id}/liked-posts` && "!bg-light-7"
              }`}>
              <img
                src={"/assets/icons/like.svg"}
                alt="like"
                width={20}
                height={20}
              />
              Liked Posts
            </Link>
          </div>
        ) : (
          <div className="profile-tab rounded-lg">
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </div>
        )}

        <Routes>
          <Route
            index
            element={user.posts.length===0? (
            <p className="text-light-4">No posts found</p>
            ) : <GridPostList posts={user.posts} showUser={false} />}
          />
          {currentUser.id===id && (
            <Route
              path="/liked-posts"
              element={<LikedPosts />}
            />
          )}
        </Routes>
      </div>
    </div>
  )
}

export default Profile