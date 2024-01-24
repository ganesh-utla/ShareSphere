import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type PostStatsProps = {
    post: Models.Document;
    userId: string;
    isGridCard?: boolean;
}

const PostStats = ({ post, userId, isGridCard=false } : PostStatsProps) => {
  
  const likesArray = post.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState<string[]>(likesArray);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: likePost } = useLikePost();
  const { mutateAsync: savePost } = useSavePost();
  const { mutateAsync: deleteSavedPost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  const handleLikePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();

    let newLikes = [...likes];
    if (newLikes.includes(userId)) {
        newLikes = newLikes.filter(id => id!==userId);
    } else {
        newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  }

  const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();

    if (isSaved) {
        setIsSaved(false);
        deleteSavedPost({ savedRecordId: savedPostRecord.$id });
    } else {
        setIsSaved(true);
        savePost({ postId: post.$id, userId: userId });
    }
  }

  return (
    <div className={`flex justify-between items-center gap-4 ${isGridCard? 'text-light-1' : 'text-dark-4'}`}>
        <div className='flex gap-3 items-center cursor-pointer' onClick={handleLikePost}>
            <img
                src={checkIsLiked(likes, userId)? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                alt="like-button"
                className='w-6 h-6'
            />
            <p className='small-medium lg:base-medium'>
                {likes.length}
            </p>
        </div>
        {
            !isGridCard &&
            <div className='flex gap-3 items-center cursor-pointer' onClick={() => navigate(`/repost/${post.$id}`)}>
                <img
                    src="/assets/icons/back.svg"
                    alt="like-button"
                    className='w-6 h-6'
                />
                <p className='hidden xs:block small-medium lg:base-medium'>
                    Repost
                </p>
            </div>
        }
        <div className='flex gap-3 items-center cursor-pointer' onClick={handleSavePost}>
            <img
                src={isSaved? "/assets/icons/saved.svg":"/assets/icons/save.svg"}
                alt="like-button"
                className='w-6 h-6'
            />
            <p className={`hidden ${!isGridCard && 'xs:block'} small-medium md:base-medium`}>
                {isSaved? "Saved" : "Save"}
            </p>
        </div>
        {
            !isGridCard &&
            <div className='flex gap-3 items-center cursor-pointer'>
                <img
                    src="/assets/icons/share.svg"
                    alt="like-button"
                    className='w-6 h-6'
                />
                <p className='hidden xs:block small-medium lg:base-medium'>
                    Share
                </p>
            </div>
        }
    </div>
  )
}

export default PostStats