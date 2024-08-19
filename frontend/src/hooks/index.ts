import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog {
  content: string;
  title: string;
  id: string;
  author: {
    name: string;
  };
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlog(response.data);
        setLoading(false);
      });
  }, [id]);

  return {
    loading,
    blog,
  };
};

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog>();

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      });
  }, []);

  return { loading, blogs };
};


export const useBlogsbyuser = () => {
  const [loading, setLoading] = useState(true);
  const [userblogs, setUserBlogs] = useState<Blog[] | undefined>([]); // Ensure it's an array
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/my-blogs`, {
          headers: {
            Authorization: token, // Add Bearer prefix
          },
        });
        console.log("Response data from /user-blogs:", response.data);
        setUserBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [token]);

  return { loading, userblogs };
};