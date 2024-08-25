import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import Pagination from "../components/Pagination";

type Blog = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  categories: string;
  author: {
    name: string;
  };
};

export const Blogs = () => {
  const { loading, blogs }: { loading: boolean; blogs: Blog[] | undefined } = useBlogs(); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const blogsPerPage = 5;

  const categories = ["All", "SPORTS", "NEWS", "CRIME", "OTHERS"];

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

  const safeBlogs = blogs ?? []; 

  const filteredBlogs = safeBlogs.filter((blog: Blog) =>
    (selectedCategory === "All" || blog.categories === selectedCategory) &&
    (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <Appbar onSearch={(term) => setSearchTerm(term)} />
      <div className="flex justify-center my-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
            className={`mx-2 px-4 py-2 rounded-lg ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {capitalizeFirstLetter(category)}
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        <div className="max-w-full">
          {loading ? (
            <div>
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
            </div>
          ) : (
            currentBlogs.map((blog: Blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                authorName={blog.author.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={blog.createdAt}
                categories={blog.categories}
              />
            ))
          )}
        </div>
      </div>
      <Pagination
        blogsPerPage={blogsPerPage}
        totalBlogs={filteredBlogs.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};
