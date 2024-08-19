import { useState } from 'react';
import { Appbar } from "../components/AppBar";
import { useBlogs, useBlogsbyuser } from "../hooks";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import Pagination from "../components/Pagination";

export const MyBlogs = () => {
  const { loading, userblogs } = useBlogsbyuser();
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
  const username = localStorage.getItem("username")

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = userblogs?.slice(indexOfFirstBlog, indexOfLastBlog);
 console.log("Blogs are", currentBlogs)
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center">
          <div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      {currentBlogs?  <div className="flex justify-center">
        <div className="max-w-full">
          {currentBlogs?.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              authorName={username} // Adjust this based on how you store and access user information
              title={blog.title}
              content={blog.content}
              publishedDate={"2nd Feb 2024"} // Adjust this as needed
            />
          ))}
        </div>
      </div> : "No blogs"}
    
      <Pagination
        blogsPerPage={blogsPerPage}
        totalBlogs={userblogs?.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};
