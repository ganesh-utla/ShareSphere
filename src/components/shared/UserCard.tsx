import { Models } from 'appwrite'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Loader } from '.';

const UserCard = ({ user } : { user : Models.Document | undefined }) => {

    const navigate = useNavigate();

    if (!user) {
        return (
            <div className='w-full flex justify-center items-center'>
                <Loader />
            </div>
        )
    }

    return (
        <Link to={`/profile/${user.$id}`} className="user-card">
            <img
                src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="creator"
                className="rounded-full w-14 h-14"
            />

            <div className="flex-center flex-col gap-1">
                <p className="base-medium text-center line-clamp-1">
                {user.name}
                </p>
                <p className="small-regular text-light-4 text-center line-clamp-1">
                @{user.username}
                </p>
            </div>

            <Button type="button" size="sm" className="shad-button_primary px-5"
                onClick={() => navigate(`/profile/${user.$id}`)}
            >
                View
            </Button>
        </Link>
    )
}

export default UserCard