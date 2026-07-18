import { cn, formatDate } from "@/lib/utils";
import { EyeIcon, TrendingUp, MapPin, Calendar, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Author, Startup } from "@/sanity/types";
import { Skeleton } from "@/components/ui/skeleton";

export type StartupTypeCard = Omit<Startup, "author"> & {
  author?: Author;
  revenue?: number;
  funding?: number;
  teamSize?: number;
  foundingYear?: number;
  location?: string;
  stage?: string;
  website?: string;
  growthData?: { year: number; revenue: number }[];
};

const StartupCard = ({ post }: { post: StartupTypeCard }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
    foundingYear,
    location,
    stage,
  } = post;

  return (
    <li className="group bg-white border border-zinc-200 rounded-2xl hover:border-zinc-300 hover:shadow-sm transition-all duration-200 overflow-hidden flex flex-col sm:flex-row relative">
      {/* Clickable Overlay */}
      <Link href={`/startup/${_id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View Startup Details</span>
      </Link>

      {/* Thumbnail Section */}
      <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative bg-zinc-100">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
        <div className="absolute top-3 left-3 z-20">
          <span className="category-tag bg-white/90 backdrop-blur-sm shadow-sm">{category}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Link href={`/user/${author?._id}`} className="relative z-20 hover:opacity-80 transition-opacity">
                <Image
                  src={author?.image || `https://ui-avatars.com/api/?name=${author?.name}`}
                  alt={author?.name || 'Author'}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </Link>
              <p className="text-sm font-medium text-zinc-500">{author?.name}</p>
            </div>
            <p className="text-xs font-medium text-zinc-400">{formatDate(_createdAt)}</p>
          </div>
          
          <h3 className="text-xl font-bold text-zinc-900 group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {title}
          </h3>
          <p className="text-sm text-zinc-600 line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer Metrics */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto pt-4 border-t border-zinc-100">
          {stage && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
              <TrendingUp className="size-3.5 text-zinc-400" />
              <span>{stage}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
              <MapPin className="size-3.5 text-zinc-400" />
              <span>{location}</span>
            </div>
          )}
          {foundingYear && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
              <Calendar className="size-3.5 text-zinc-400" />
              <span>{foundingYear}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 ml-auto bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
            <EyeIcon className="size-3.5 text-primary" />
            <span>{views} Views</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={`skeleton-${index}`} className="flex flex-col sm:flex-row bg-white border border-zinc-200 rounded-2xl overflow-hidden h-[200px]">
        <Skeleton className="w-full sm:w-48 h-48 sm:h-full rounded-none" />
        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-24 h-4" />
            </div>
            <Skeleton className="w-3/4 h-6 mb-2" />
            <Skeleton className="w-full h-4 mb-1" />
            <Skeleton className="w-2/3 h-4" />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-4">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-20 h-6 rounded-md" />
          </div>
        </div>
      </li>
    ))}
  </>
);

export default StartupCard;