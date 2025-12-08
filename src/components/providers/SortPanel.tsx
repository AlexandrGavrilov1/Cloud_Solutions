// SortPanel.tsx
interface SortPanelProps {
  sortBy: "rating" | "price";
  setSortBy: (sortBy: "rating" | "price") => void;
}

export const SortPanel = ({ sortBy, setSortBy }: SortPanelProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Сортировка
        </span>
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
          />
        </svg>
      </div>

      <div className="relative bg-muted rounded-lg p-1 flex">
        {/* Тумблер */}
        <div
          className={`absolute top-1 bottom-1 w-1/2 bg-background shadow-sm rounded-md transition-transform duration-200 ease-in-out ${
            sortBy === "rating" ? "translate-x-0" : "translate-x-full"
          }`}
        />

        <button
          onClick={() => setSortBy("rating")}
          className={`relative z-10 flex-1 p-3 rounded-md transition-all flex items-center justify-center ${
            sortBy === "rating"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="По рейтингу"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={sortBy === "rating" ? 2.5 : 1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>

        <button
          onClick={() => setSortBy("price")}
          className={`relative z-10 flex-1 p-3 rounded-md transition-all flex items-center justify-center ${
            sortBy === "price"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="По цене"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={sortBy === "price" ? 2.5 : 1.5}
              d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={sortBy === "price" ? 2.5 : 1.5}
              d="M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
