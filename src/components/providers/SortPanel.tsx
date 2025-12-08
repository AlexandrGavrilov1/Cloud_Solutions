// SortPanel.tsx
interface SortPanelProps {
  sortBy: "rating" | "price";
  setSortBy: (sortBy: "rating" | "price") => void;
}

export const SortPanel = ({ sortBy, setSortBy }: SortPanelProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Заголовок "Сортировка" по центру над кнопками */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center bg-[rgba(255,143,51,0.2)] rounded-lg">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 9l7 7 7-7"
            />
          </svg>
        </div>
        <span className="text-sm font-medium text-white whitespace-nowrap">
          Сортировка
        </span>
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
              ? "text-[#FF8F33]"
              : "text-white hover:text-gray-200"
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
              ? "text-[#FF8F33]"
              : "text-white hover:text-gray-200"
          }`}
          title="По цене"
        >
          <span
            className={`text-lg font-bold ${sortBy === "price" ? "text-[#FF8F33]" : "text-white"}`}
          >
            ₽
          </span>
        </button>
      </div>
    </div>
  );
};
