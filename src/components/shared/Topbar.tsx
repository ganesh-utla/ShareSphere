import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const Topbar = () => {

  const { mutateAsync: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
        navigate(0);
    }
  }, [isSuccess]);

  return (
    <section className='topbar'>
        <div className='flex-between py-4 px-5 items-center'>
            <Link to="/" className='flex-between gap-3 items-center'>
                <img
                    src="/assets/images/logo.png"
                    alt="logo"
                    className="max-h-12"
                />
            </Link>

            <div className='flex gap-0 xs:gap-4 items-center'    >
                <Button 
                    variant='ghost'
                    className='shad-button_ghost' 
                    onClick={() => signOut()}
                >
                    <img
                        src="/assets/icons/logout.svg"
                        alt="logout"
                        width={24}
                        height={24}
                    />
                </Button>
                <Link to={`/profile/${user.id}`}>
                    <img
                        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                        alt="profile"
                        className='h-8 w-8 rounded-full'
                    />
                </Link>
            </div>
        </div>
    </section>
  )
}

export default Topbar