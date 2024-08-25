// import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import { format } from 'date-fns';

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
  
// Update the Blog interface if needed
export const FullBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div>
      <Appbar onSearch={(term) => console.log('Search term:', term)} />
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl pt-12">
          <div className="col-span-8">
            <div className="text-5xl font-extrabold">
              {blog?.title}
            </div>
            <div className="text-slate-500 pt-2">
              {format(new Date(blog?.createdAt), "do MMM yyyy")}
            </div>
            <div className="pt-4">
              {blog?.content}
            </div>
          </div>
          <div className="col-span-4">
            <div className="text-slate-600 text-lg">Author</div>
            <div className="flex w-full">
              <div className="pr-4 flex flex-col justify-center">
                <Avatar size="big" name={blog?.author.name || "Anonymous"} />
              </div>
              <div>
                <div className="text-xl font-bold">
                  {blog?.author.name || "Anonymous"}
                </div>
                <div className="pt-2 text-slate-500">
                  Random catch phrase about the author's ability to grab the user's attention
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};