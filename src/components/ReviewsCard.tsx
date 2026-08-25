import { review } from "@/db/schema";
import { Star } from "lucide-react";

export const ReviewsCard = ({ r }: { r: any }) => {
  return (
    <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-sm text-gray-900">{r.authorName}</span>
        {r.createdAt && <span className="text-xs text-gray-400">{r?.createdAt.toString()}</span>}
      </div>
      <StarRating rating={r.rating} />
      <p className="text-xs text-gray-600 mt-2 line-clamp-5">{r.body}</p>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}
