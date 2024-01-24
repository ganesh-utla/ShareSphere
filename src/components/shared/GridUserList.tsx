import { Models } from 'appwrite'
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

type GridUserListProps = {
    users : Models.Document[] | undefined;
    showUser?: boolean;
    showStats?: boolean;
}

const GridUserList = ({ users } : GridUserListProps) => {

    return (
        <ul className="user-grid">
            {users?.map((user) => (
              <li key={user.$id} className="flex-1 min-w-[200px] w-full  ">
                <Link to={`/profile/${user.$id}`} className="user-card">
                    <img
                        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                        alt="creator"
                        className="rounded-full w-14 h-14"
                    />

                    <div className="flex-center flex-col gap-1">
                        <p className="base-medium text-light-1 text-center line-clamp-1">
                        {user.name}
                        </p>
                        <p className="small-regular text-light-3 text-center line-clamp-1">
                        @{user.username}
                        </p>
                    </div>

                    <Button type="button" size="sm" className="shad-button_primary px-5">
                        Follow
                    </Button>
                </Link>
              </li>
            ))}
          </ul>
    )
}

export default GridUserList