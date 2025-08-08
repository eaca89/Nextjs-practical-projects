"use client";

import { formatDate } from "@/lib/format";
import LikeButton from "./like-icon";
import { togglePostLikeStatus } from "@/actions/posts";
import { useOptimistic } from "react";

function Post({ post, action }) {
  return (
    <article className="post">
      <div className="post-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{" "}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <form
              action={action.bind(null, post.id)}
              className={post.isLiked ? "liked" : ""}
            >
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }) {
  const [opimisticPosts, updateOptimisticPosts] = useOptimistic(
    posts,
    (prevPosts, updatedPostId) => {
      const updatedPostIndex = prevPosts.findIndex(
        (post) => post.id === updatedPostId
      );

      // If the post isn't found, just return the previous state
      if (updatedPostIndex === -1) {
        return prevPosts;
      }
      // Create a copy of the post to avoid directly changing the original data
      const updatedPost = { ...prevPosts[updatedPostIndex] };
      // Toggle the 'likes' count and the 'isLiked' status
      updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1);
      updatedPost.isLiked = !updatedPost.isLiked;
      // Create a new array of posts and place the updated post in it
      const newPosts = [...prevPosts];
      newPosts[updatedPostIndex] = updatedPost;
      // Return the new list of posts
      return newPosts;
    }
  );

  if (!opimisticPosts || opimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  // This function is called when a user clicks the like button.
  async function updatePost(postId) {
    // 1. Immediately update the UI with the optimistic state
    updateOptimisticPosts(postId);
    // 2. Send the network request in the background
    await togglePostLikeStatus(postId);
  }

  return (
    <ul className="posts">
      {opimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatePost} />
        </li>
      ))}
    </ul>
  );
}
