"use client";

import { useState } from "react";
import { blogCategories, posts } from "@/content/blog";
import { FilterChips } from "./filter-chips";
import { PostCard } from "./post-card";

const PAGE_SIZE = 6;

/** Category filter and "Load more" pagination for the blog index. */
export const BlogGrid = () => {
  const [category, setCategory] = useState("All");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const filtered = category === "All" ? posts : posts.filter((p) => p.category === category);
  const visible = filtered.slice(0, limit);

  const choose = (value: string) => {
    setCategory(value);
    setLimit(PAGE_SIZE);
  };

  return (
    <>
      <div data-reveal className="mb-10">
        <FilterChips label="Filter articles by category" options={blogCategories} value={category} onChange={choose} />
      </div>
      <div key={category} className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post, i) => (
          <PostCard key={post.slug} post={post} reveal={false} className="motion-safe:animate-[fade-in_0.6s_ease-out_both]" style={{ animationDelay: `${(i % PAGE_SIZE) * 60}ms` }} />
        ))}
      </div>
      {filtered.length > limit ? (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="h-12 rounded-full border border-line bg-white px-7 text-sm font-medium transition-[background-color,transform] hover:bg-paper active:scale-[0.97]"
          >
            Load more articles
          </button>
        </div>
      ) : null}
    </>
  );
};
