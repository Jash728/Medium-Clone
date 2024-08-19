import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";

  if (!authHeader) {
    c.status(403);
    return c.json({ message: "No authorization header" });
  }

  try {
    const token = authHeader.trim(); 

    const user = await verify(token, c.env.JWT_SECRET);
   
    
    if (user) {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        message: "You are not logged in",
      });
    }
  } catch (e) {
    console.error("Error during token verification:", e);
    c.status(403);
    return c.json({
      message: "Invalid token",
    });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });
    return c.json({
      id: post.id,
    });
  } catch (error) {
    console.error("Error creating post:", error); // Log the error for debugging
    c.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
});

blogRouter.put("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const updatedPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json(updatedPost);
});

blogRouter.get("/my-blogs", async (c) => {
  const userId = c.get("userId");

  if (!userId) {
    c.status(403);
    return c.json({ message: "Not authorized" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt:true,
      },
    });

    return c.json(posts);
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    c.status(500);
    return c.json({ message: "Failed to fetch posts", error: error.message });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      createdAt:true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return c.json(posts);
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt:true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return c.json(post);
});

blogRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  await prisma.post.delete({
    where: {
      id,
    },
  });

  return c.json({ message: 'Blog post deleted successfully' });
});


