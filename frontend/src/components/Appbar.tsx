import { useState } from 'react';
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";

export const Appbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate('/signin');
  };

  const user = localStorage.getItem("username");

  return (
    <div className="border-b flex justify-between px-10 py-4 items-center">
      <Link to={"/blogs"} className="flex flex-col justify-center cursor-pointer">
        Medium
      </Link>
      <div className="flex items-center">
        <Link to={`/publish`}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            New
          </button>
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center"
          >
            <Avatar size={"big"} name={user} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              <ul className="py-1 text-sm text-gray-700">
                <li>
                  <Link
                    to={`/my-blogs`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Blogs
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
