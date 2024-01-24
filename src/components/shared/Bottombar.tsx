import { bottombarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Link, useLocation } from "react-router-dom";

const Bottombar = () => {

  const { pathname } = useLocation();

  return (
    <section className='bottom-bar'>
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname===link.route;
        return (
        <Link 
          key={link.label} 
          to={link.route} 
          className={`${isActive && 'bg-primary-500 text-light-1 rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}
        >
          <img
            src={link.imgURL}
            alt={link.label}
            className={`w-5 h-5 ${isActive && 'invert-white'}`}
          />
          <p className="tiny-medium">
            {link.label}
          </p>
        </Link>
      )})}
    </section>
  )
}

export default Bottombar