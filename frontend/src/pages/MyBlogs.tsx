import { useState } from 'react';
import { Appbar } from "../components/AppBar";
import { useBlogsbyuser } from "../hooks";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import Pagination from "../components/Pagination";
import { Modal } from '../components/Modal';
import { BACKEND_URL } from '../config';

import { format } from 'date-fns';

export const MyBlogs = () => {
  const { loading, userblogs, refetch } = useBlogsbyuser();
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
  const username = localStorage.getItem("username");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = userblogs?.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openEditModal = (id, currentTitle, currentContent) => {
    setEditBlogId(id);
    setTitle(currentTitle);
    setContent(currentContent);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      console.log(editBlogId)
      const response = await fetch(`${BACKEND_URL}/api/v1/blog/${editBlogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token // Ensure no leading/trailing spaces
        },
        body: JSON.stringify({ title, content }),
      });
  
      if (response.ok) {
        refetch();
        setIsModalOpen(false);
        alert('Blog updated successfully');
      } else {
        alert('Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };
  
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/blog/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': token // Ensure no leading/trailing spaces
          },
        });

        if (response.ok) {
          refetch();
          alert('Blog deleted successfully');
        } else {
          alert('Failed to delete blog');
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

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
      {currentBlogs ? (
        <div className="flex justify-center">
          <div className="max-w-full">
            {currentBlogs.map((blog) => (
              <div key={blog.id} className="bg-white p-6 rounded-lg shadow-md mb-4">
                <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
                <p className="text-gray-700 mb-4">by {username}</p>
                <p className="text-gray-600 mb-4">{blog.content}</p>
                <p className="text-gray-500 mb-4">{format(new Date(blog.createdAt), "do MMM yyyy")}</p>
                <button
                  onClick={() => openEditModal(blog.id, blog.title, blog.content)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        "No blogs"
      )}
      <Pagination
        blogsPerPage={blogsPerPage}
        totalBlogs={userblogs?.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEditSubmit}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
      />
    </div>
  );
};
