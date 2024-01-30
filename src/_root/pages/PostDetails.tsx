import { Loader, PostStats, RelatedPosts, CommentCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePost, useGetPostById, usePostComment } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"


const PostDetails = () => {

  const { id } = useParams();
  const { data: post, isPending: isPostLoading } = useGetPostById(id || '');
  const { mutateAsync: postComment, isPending: isCommenting } = usePostComment(id || "");
  const { mutateAsync: deletePost } = useDeletePost();
  const { user } = useUserContext();
  const [showComments, setShowComments] = useState(true);
  const [commentValue, setCommentValue] = useState("");
  const navigate = useNavigate();

  const handleDeletePost = async () => {
    await deletePost({postId: id || "", imageId: post?.imageId});
    navigate(-1);
  }

  const handleComment = async () => {
    if (!isCommenting) {
      await postComment({ userId: user.id, comment: commentValue, postId: id || ""});
      setCommentValue("");
    }
  }

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={() => navigate(-1)}
        >
          <img 
            src="/assets/icons/back.svg"
            alt="back"
            className="w-5 h-5"
          />
          <p className="small-medium lg:base-medium">
            Back
          </p>
        </Button>
      </div>

      {isPostLoading || !post? 
        <Loader /> : (
          <div className="post_details-card mt-5">
            <img
                src={post.imageUrl}
                alt="post-image"
                className='post_details-img'
            />

            <div className="post_details-info">
              <div className="flex w-full flex-between flex-wrap gap-3">
                <Link to={`/profile/${post.creator.$id}`} className="flex items-center gap-3">
                    <img
                        src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                        alt={post.creator}
                        className="w-8 h-8 rounded-full"
                    />
                  <div className='flex flex-col'>
                      <p className='base-medium text-dark-3'>
                          {post.creator.name}
                      </p>
                      <p className='subtle-semibold lg:small-regular text-light-4'>
                          {post.location && `${post.location} • `}{multiFormatDateString(post.$createdAt)}
                      </p>
                  </div>
                </Link>

                <div className="flex-center gap-4">
                  <Link to={`/update-post/${post.$id}`} className={`${user.id!==post.creator.$id && "hidden"}`}>
                      <img
                          src="/assets/icons/edit.svg"
                          alt="edit-post"
                          className='w-6 h-6'
                      />
                  </Link>
                  <Link to={`/repost/${post.$id}`} className='cursor-pointer'>
                    <img
                        src="/assets/icons/repost.svg"
                        alt="edit-post"
                        className='w-8 h-8'
                    />
                  </Link>
                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className={`post_details-delete_btn ${user.id !== post?.creator.$id && "!hidden"}`}
                  >
                    <img
                      src={"/assets/icons/delete.svg"}
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
              </div>

              <hr className="border w-full border-light-3" />

              <div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
                <p className=' text-dark-4'>
                    {post.caption}  
                </p>
                <ul className='flex gap-1 mt-2 flex-wrap'>
                    {post.tags.map((tag: string) => (
                        <li key={tag} className='text-light-3 small-regular'>
                            #{tag}
                        </li>
                    ))}
                </ul>
              </div>

              <div className="w-full">
                <PostStats post={post} userId={user.id} handleCommentClick={() => setShowComments(prev => !prev)} />
              </div>
            </div>
          </div>
        )
      }

      <div className="w-full flex items-center max-w-5xl gap-5">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="search"
          className="w-11 h-11 rounded-full max-xs:hidden"
        />
        <Input 
          type="text"
          placeholder="Type something..." 
          value={commentValue}
          onChange={(e) => setCommentValue(e.target.value)}
          className="comment-input"
        />
        <Button 
          className="bg-primary-500 h-12 px-4 rounded-md flex items-center cursor-pointer hover:bg-primary-600 transition-all"
          onClick={handleComment}
          disabled={commentValue==="" || isCommenting}
          >
          <img
            src={`/assets/icons/${isCommenting? "loader" : "send"}.svg`}
            alt="comment"
            className="w-8 h-8"
          />
        </Button>
      </div>

      {
        showComments && post?.comments && (  
        <div className="w-full max-w-5xl flex flex-col items-start justify-start gap-5">
          {post.comments.map((comment: Models.Document) => (
            <CommentCard comment={comment} key={comment.$id} postId={post.$id} />
          ))}
        </div>
      )}

      <RelatedPosts userId={post?.creator.$id} postId={post?.$id} />

    </div>
  )
}

export default PostDetails