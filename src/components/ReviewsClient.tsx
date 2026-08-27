"use client";

import { useState } from "react";
import { Pagination } from "@/components/shared/Pagination";
import { usePagination } from "@/components/shared/breadcrumbs/usePagination";

import type { review } from "@/db/schema";

const STAR_PATH =
  "M11.2827 3.45332C11.5131 2.98638 11.6284 2.75291 11.7848 2.67831C11.9209 2.61341 12.0791 2.61341 12.2152 2.67831C12.3717 2.75291 12.4869 2.98638 12.7174 3.45332L14.9041 7.88328C14.9721 8.02113 15.0061 8.09006 15.0558 8.14358C15.0999 8.19096 15.1527 8.22935 15.2113 8.25662C15.2776 8.28742 15.3536 8.29854 15.5057 8.32077L20.397 9.03571C20.9121 9.11099 21.1696 9.14863 21.2888 9.27444C21.3925 9.38389 21.4412 9.5343 21.4215 9.68377C21.3988 9.85558 21.2124 10.0372 20.8395 10.4004L17.3014 13.8464C17.1912 13.9538 17.136 14.0076 17.1004 14.0715C17.0689 14.128 17.0487 14.1902 17.0409 14.2545C17.0321 14.3271 17.0451 14.403 17.0711 14.5547L17.906 19.4221C17.994 19.9355 18.038 20.1922 17.9553 20.3445C17.8833 20.477 17.7554 20.57 17.6071 20.5975C17.4366 20.6291 17.2061 20.5078 16.7451 20.2654L12.3724 17.9658C12.2361 17.8942 12.168 17.8584 12.0962 17.8443C12.0327 17.8318 11.9673 17.8318 11.9038 17.8443C11.832 17.8584 11.7639 17.8942 11.6277 17.9658L7.25492 20.2654C6.79392 20.5078 6.56341 20.6291 6.39297 20.5975C6.24468 20.57 6.11672 20.477 6.04474 20.3445C5.962 20.1922 6.00603 19.9355 6.09407 19.4221L6.92889 14.5547C6.95491 14.403 6.96793 14.3271 6.95912 14.2545C6.95132 14.1902 6.93111 14.128 6.89961 14.0715C6.86402 14.0076 6.80888 13.9538 6.69859 13.8464L3.16056 10.4004C2.78766 10.0372 2.60121 9.85558 2.57853 9.68377C2.55879 9.5343 2.60755 9.38389 2.71125 9.27444C2.83044 9.14863 3.08797 9.11099 3.60304 9.03571L8.49431 8.32077C8.64642 8.29854 8.72248 8.28742 8.78872 8.25662C8.84736 8.22935 8.90016 8.19096 8.94419 8.14358C8.99391 8.09006 9.02793 8.02113 9.09597 7.88328L11.2827 3.45332Z";

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0"
        >
          <path
            d={STAR_PATH}
            fill="#FFBD72"
            stroke="#FFBD72"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

interface ReviewCardProps {
  name: string;
  date: Date;
  text: string;
  stars?: number;
}

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));

export function ReviewCard({ name, date, text, stars = 5 }: ReviewCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[10px] bg-white p-5 md:p-6">
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <p className="font-manrope text-lg font-bold text-[#222] md:text-xl">
          {name}
        </p>
        <p className="font-manrope shrink-0 text-sm leading-6 text-[#666] md:text-lg">
          {formatDate(date)}
        </p>
      </div>
      <StarRating count={stars} />
      <p className="font-manrope line-clamp-4 w-full text-base leading-relaxed text-[#666] md:text-lg">
        {text}
      </p>
    </div>
  );
}

type Review = typeof review.$inferSelect;
interface Props {
  initialReviews: Review[];
  totalPages: number;
  currentPage: number;
}

export function ReviewsClient({
  initialReviews,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
}: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const { currentPage, totalPages, setPages } = usePagination(
    initialCurrentPage,
    initialTotalPages,
  );

  return (
    <>
      <div className="mb-15 flex w-full flex-col gap-4 md:gap-6">
        {reviews
          .reduce((acc: (typeof reviews)[], _, i) => {
            if (i % 3 === 0) acc.push(reviews.slice(i, i + 3));
            return acc;
          }, [])
          .map((group, rowIdx) => (
            <div
              key={rowIdx}
              className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
            >
              {group.map((r, i) => (
                <ReviewCard
                  key={i}
                  name={r.authorName}
                  date={r.createdAt!}
                  text={r.body!}
                  stars={r.rating}
                />
              ))}
            </div>
          ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setPages({ current: page, total: totalPages })}
      />
    </>
  );
}
