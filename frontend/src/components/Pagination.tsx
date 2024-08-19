import React from 'react';

const Pagination = ({ blogsPerPage, totalBlogs, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalBlogs / blogsPerPage); i++) {
    pageNumbers.push(i); // [1, 2]
  }

  return (
    <nav className="flex justify-center my-4">
      <ul className="flex space-x-2">
        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border rounded-lg`}>
            <button
              onClick={() => paginate(number)}
              className={`page-link px-4 py-2 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border rounded-lg`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
