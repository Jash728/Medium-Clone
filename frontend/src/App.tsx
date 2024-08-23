import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { Blog } from './pages/Blog';
import { Blogs } from "./pages/Blogs";
import { Publish } from './pages/Publish';
import { MyBlogs } from './pages/MyBlogs';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Signin />} />
        <Route path="/blog/:id" element={<ProtectedRoute element={<Blog />} />} />
        <Route path="/blogs" element={<ProtectedRoute element={<Blogs />} />} />
        <Route path="/publish" element={<ProtectedRoute element={<Publish />} />} />
        <Route path="/my-blogs" element={<ProtectedRoute element={<MyBlogs />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
