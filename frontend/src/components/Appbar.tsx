import { useState } from "react";
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";

export const Appbar = ({ onSearch }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const user = localStorage.getItem("username");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="border-b flex justify-between px-10 py-4 items-center bg-white shadow">
      <Link to={"/blogs"} className="text-xl font-semibold cursor-pointer">
        Medium
      </Link>
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="text-sm p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg"
          >
            Search
          </button>
        </div>
        <Link to={`/publish`}>
          <button
            type="button"
            className="ml-4 text-white bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg"
          >
            New
          </button>
        </Link>
        <div className="relative ml-4">
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
