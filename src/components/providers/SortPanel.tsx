// SortPanel.tsx
interface SortPanelProps {
  sortBy: 'rating' | 'price';
  setSortBy: (sortBy: 'rating' | 'price') => void;
}

export const SortPanel = ({ sortBy, setSortBy }: SortPanelProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        Сортировка:
      </span>
      <div className="flex bg-muted rounded-lg p-1">
        <button
          onClick={() => setSortBy('rating')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            sortBy === 'rating'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          По рейтингу
        </button>
        <button
          onClick={() => setSortBy('price')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            sortBy === 'price'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          По цене
        </button>
      </div>
    </div>
  );
};
