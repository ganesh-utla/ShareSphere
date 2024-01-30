import { useDeleteComment } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite"
import { Link } from "react-router-dom"

type CommentCardProps = {
    comment: Models.Document;
    postId: string;
}

const CommentCard = ({ comment, postId } : CommentCardProps) => {

  const { mutateAsync: deleteComment, isPending: isDeleting } = useDeleteComment(postId);

  const handleDelete = async () => {
    if (!isDeleting) {
        await deleteComment(comment.$id);
    }
}

  return (
    <div className="max-w-5xl flex flex-col gap-1 bg-light-5 border border-light-7 py-2 px-4 rounded-xl">
        <div className="flex-between gap-20">
            <div className='flex items-center gap-4'>
                <Link to={`/profile/${comment.creator.$id}`}>
                    <img
                        src={comment.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                        alt={comment.creator.name}
                        className="w-8 h-8 rounded-full"
                    />
                </Link>
                <div className="flex flex-col xs:flex-row xs:items-end xs:gap-2">
                    <Link to={`/profile/${comment.creator.$id}`}>
                        <p className='base-medium text-dark-3'>
                            {comment.creator.name}
                        </p>
                    </Link>
                    <p className='small-regular text-light-4'>
                        {multiFormatDateString(comment.$createdAt)}
                    </p>
                </div>
            </div>
            <div className='flex justify-center items-center gap-3 cursor-pointer' onClick={handleDelete}>
                <img
                    src={`/assets/icons/${isDeleting? "loader" : "delete"}.svg`}
                    alt="delete-comment"
                    className='w-6 h-6'
                />
            </div>
        </div>
        <p className="max-xs:my-2 xs:ml-12 small-regular text-dark-3 break-words">
            {comment.comment}
        </p>
    </div>
  )
}

export default CommentCard