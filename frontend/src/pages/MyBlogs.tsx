import { useState } from 'react';
import { Appbar } from "../components/Appbar";
import { useBlogsbyuser } from "../hooks";
import { BlogSkeleton } from "../components/BlogSkeleton";
import Pagination from "../components/Pagination";
import { Modal } from '../components/Modal';
import { BACKEND_URL } from '../config';
import { format } from 'date-fns';

type Blog = {
  id: string;
  title: string;
  content: string;
  createdAt?: string; 
};

export const MyBlogs = () => {
  const { loading, userblogs, refetch } = useBlogsbyuser(); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const blogsPerPage = 5;
  const username = localStorage.getItem("username");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editBlogId, setEditBlogId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

  const filteredBlogs = userblogs?.filter(
    (blog: Blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentBlogs = filteredBlogs?.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const openEditModal = (id: string, currentTitle: string, currentContent: string) => {
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
      const response = await fetch(`${BACKEND_URL}/api/v1/blog/${editBlogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
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
  
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/blog/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': token || ""
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
        <Appbar onSearch={(term: string) => setSearchTerm(term)} />
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
    <div className="min-h-screen bg-gray-50">
      <Appbar onSearch={(term: string) => setSearchTerm(term)} />
      {currentBlogs && currentBlogs.length > 0 ? (
        <div className="flex justify-center mt-8">
          <div className="w-full max-w-4xl">
            {currentBlogs.map((blog: Blog) => (
              <div key={blog.id} className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
                <p className="text-gray-600 text-sm mb-4">by {username}</p>
                <p className="text-gray-700 mb-4">{blog.content}</p>
                {blog.createdAt && ( // Ensure createdAt exists before formatting
                  <p className="text-gray-500 text-sm mb-4">{format(new Date(blog.createdAt), "do MMM yyyy")}</p>
                )}
                <div className="flex space-x-4">
                  <button
                    onClick={() => openEditModal(blog.id, blog.title, blog.content)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-8">
          <p className="text-gray-600 text-lg">No blogs found.</p>
        </div>
      )}
      <Pagination
        blogsPerPage={blogsPerPage}
        totalBlogs={filteredBlogs?.length ?? 0}
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
