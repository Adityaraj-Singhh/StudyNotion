import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
  className={`sticky top-0 z-50 flex h-16 items-center justify-center border-b border-richblack-700 backdrop-blur-md ${
    location.pathname !== "/" ? "bg-richblack-900/90" : "bg-transparent"
  } transition-all duration-300`}
>
  <div className="flex w-11/12 max-w-[1200px] items-center justify-between">
    {/* Logo */}
    <Link to="/">
      <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
    </Link>

    {/* Navigation Links */}
    <nav className="hidden md:block">
      <ul className="flex gap-x-6 text-sm font-medium text-richblack-100">
        {NavbarLinks.map((link, index) => (
          <li key={index} className="relative group">
            {link.title === "Catalog" ? (
              <div
                className={`flex items-center gap-1 cursor-pointer ${
                  matchRoute("/catalog/:catalogName") ? "text-yellow-100" : ""
                }`}
              >
                <p>{link.title}</p>
                <BsChevronDown className="text-xs" />
              </div>
            ) : (
              <Link
                to={link.path}
                className={`hover:text-yellow-100 transition ${
                  matchRoute(link.path) ? "text-yellow-100" : ""
                }`}
              >
                {link.title}
              </Link>
            )}

            {/* Dropdown */}
            {link.title === "Catalog" && (
              <div className="absolute left-1/2 top-full z-20 hidden w-[260px] -translate-x-1/2 translate-y-2 rounded-xl bg-richblack-800/95 p-4 text-richblack-5 shadow-lg ring-1 ring-richblack-700 backdrop-blur-md group-hover:block">
                {loading ? (
                  <p className="text-center text-sm text-richblack-300">Loading...</p>
                ) : Array.isArray(subLinks) && subLinks.length > 0 ? (
                  subLinks
                    .filter((sub) => Array.isArray(sub?.courses) && sub.courses.length > 0)
                    .map((subLink, i) => (
                      <Link
                        key={i}
                        to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                        className="block rounded-md px-3 py-2 text-sm font-normal text-richblack-100 hover:bg-richblack-700"
                      >
                        {subLink.name}
                      </Link>
                    ))
                ) : (
                  <p className="text-center text-sm text-richblack-300">No Courses Found</p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>

    {/* Buttons & Profile */}
    <div className="hidden md:flex items-center gap-x-4">
      {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
        <Link to="/dashboard/cart" className="relative">
          <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
          {totalItems > 0 && (
            <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-yellow-100 text-xs font-bold text-richblack-900">
              {totalItems}
            </span>
          )}
        </Link>
      )}

      {!token ? (
        <>
          <Link to="/login">
            <button className="rounded-md border border-richblack-700 bg-transparent px-4 py-2 text-sm text-richblack-100 transition hover:bg-richblack-700">
              Log in
            </button>
          </Link>
          <Link to="/signup">
            <button className="rounded-md bg-yellow-100 px-4 py-2 text-sm font-medium text-richblack-900 transition hover:brightness-95">
              Sign up
            </button>
          </Link>
        </>
      ) : (
        <ProfileDropdown />
      )}
    </div>

    {/* Mobile Menu */}
    <button className="md:hidden">
      <AiOutlineMenu fontSize={24} className="text-richblack-100" />
    </button>
  </div>
</div>

  )
}

export default Navbar