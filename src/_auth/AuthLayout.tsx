import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {

  const isAuthenticated = false;

  return (
    <> 
    {
      isAuthenticated? (
        <Navigate to="/" />
      ) : (
        <div className="flex w-full h-screen overflow-hidden">
          <section className="flex flex-1 flex-col justify-center items-center pt-20 pb-10 overflow-auto custom-scrollbar scroll-transparent">
            <Outlet />
          </section>
          <div className="hidden lg:flex relative h-screen w-1/2 justify-center items-center globe-bg">
            <img
              src="/assets/images/rocket.png"
              alt="rocket"
              className="max-w-50 object-contain"
            />
          </div>
        </div>
      )
    }
    </>
  )
}

export default AuthLayout