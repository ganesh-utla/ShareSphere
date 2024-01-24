import { useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'

const LeftSidebar = () => {

  const { mutateAsync: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isSuccess) {
        navigate(0);
    }
  }, [isSuccess]);

  return (
    <section className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to="/" className='flex gap-3 items-center'>
          <img
              src="/assets/images/logo.png"
              alt="logo"
              className="max-h-14"
          />
        </Link>

        <Link to={`/profile/${user.id}`} className='flex items-center gap-4'>
            <img
                src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="profile"
                className='h-14 w-14 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='body-bold'>
                {user.name}
              </p>
              <p className='small-regular text-light-4'>
                @{user.username}
              </p>
            </div>
        </Link>

        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname===link.route;
            return (
            <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500 text-light-1'}`}>
              <NavLink to={link.route} className={`flex gap-4 items-center p-4 group-hover:text-light-1`}>
                <img
                  src={link.imgURL}
                  alt={link.label}
                  className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                />
                {link.label}
              </NavLink>
            </li>
          )})}
        </ul>
      </div>

      <Button 
          variant='ghost'
          className='shad-button_ghost' 
          onClick={() => signOut()}
      >
          <img
              src="/assets/icons/logout.svg"
              alt="logout"
          />
          <p className="base-medium">Logout</p>
      </Button>
    </section>
  )
}

export default LeftSidebar