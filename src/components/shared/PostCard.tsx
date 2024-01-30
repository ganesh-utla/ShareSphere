import { useUserContext } from '@/context/AuthContext'
import { multiFormatDateString } from '@/lib/utils';
import { Models } from 'appwrite'
import { Link, useNavigate } from 'react-router-dom'
import { PostStats } from '.';

const PostCard = ({ post } : { post : Models.Document }) => {

  const { user } = useUserContext();
  const navigate = useNavigate();

  return (
    <div key={post.$id} className="post-card flex flex-col gap-5">
        <div className="flex-between">
            <div className='flex items-center gap-5'>
                <Link to={`/profile/${post.creator.$id}`}>
                    <img
                        src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                        alt={post.creator.name}
                        className="w-10 h-10 rounded-full"
                    />
                </Link>
                <div className='flex flex-col'>
                    <Link to={`/profile/${post.creator.$id}`}>
                        <p className='base-medium text-dark-3'>
                            {post.creator.name}
                        </p>
                    </Link>
                    <p className='subtle-semibold lg:small-regular text-light-4'>
                        {post.location && `${post.location} • `}{multiFormatDateString(post.$createdAt)}
                    </p>
                </div>
            </div>
            <div className='flex justify-center items-center gap-3'>
                <Link to={`/update-post/${post.$id}`} className={`cursor-pointer ${user.id!==post.creator.$id && "hidden"}`}>
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
            </div>
        </div>

        <div className='small-medium lg:base-medium'>
            <p className=' text-dark-4'>
                {post.caption}  
            </p>
            <ul className='flex flex-wrap gap-1 mt-2'>
                {post.tags.map((tag: string) => (
                    <li key={tag} className='text-light-3 small-regular'>
                        #{tag}
                    </li>
                ))}
            </ul>
        </div>

        <Link to={`/posts/${post.$id}`}>
            <img
                src={post.imageUrl}
                alt="post-image"
                className='post-card_img'
            />
        </Link>

        <PostStats post={post} userId={user.id} handleCommentClick={() => navigate(`/posts/${post.$id}`)} />
    </div>
  )
}

export default PostCard