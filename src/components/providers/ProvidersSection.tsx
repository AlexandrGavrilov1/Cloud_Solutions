// Если у вас есть интерфейс для ComparisonControls:
interface ComparisonControlsProps {
  selectedForComparison: number[];
  compareProviders: () => void;
  onCancelComparison: () => void;
}

// Если у вас есть интерфейс для ProvidersList:
interface ProvidersListProps {
  filteredProviders: Provider[];
  reviewsToShow: Record<number, number>;
  setReviewsToShow: React.Dispatch<
    React.SetStateAction<Record<number, number>>
  >;
  selectedProvider: Provider | null;
  setSelectedProvider: (provider: Provider | null) => void;
  selectedForComparison: number[];
  toggleComparison: (providerId: number) => void;
}

// Если у вас есть интерфейс для SearchInput:
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

// Если у вас есть интерфейс для SortPanel:
interface SortPanelProps {
  sortBy: "rating" | "price";
  setSortBy: (sortBy: "rating" | "price") => void;
}

// Если у вас есть интерфейс для ProvidersCounter:
interface ProvidersCounterProps {
  currentCount: number;
  totalCount: number;
  className?: string;
}
