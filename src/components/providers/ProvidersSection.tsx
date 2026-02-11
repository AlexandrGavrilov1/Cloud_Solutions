import { Provider } from "./types";
import { ProviderCard } from "./ProviderCard";

interface ProvidersListProps {
  filteredProviders: Provider[];
  reviewsToShow: Record<number, number>;
  setReviewsToShow: (value: Record<number, number>) => void;
  selectedProvider: Provider | null;
  setSelectedProvider: (provider: Provider | null) => void;
  selectedForComparison: number[];
  toggleComparison: (providerId: number) => void;
}

export const ProvidersList = ({
  filteredProviders,
  reviewsToShow,
  setReviewsToShow,
  selectedProvider,
  setSelectedProvider,
  selectedForComparison,
  toggleComparison,
}: ProvidersListProps) => {
  return (
    <div className="grid grid-cols-1 min-[950px]:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredProviders.map((provider, index) => (
        <ProviderCard
          key={provider.id}
          provider={provider}
          index={index}
          showDetails={selectedProvider?.id === provider.id}
          onToggleDetails={() =>
            setSelectedProvider(
              selectedProvider?.id === provider.id ? null : provider,
            )
          }
          reviewsToShow={reviewsToShow[provider.id] || 5}
          onLoadMoreReviews={() =>
            setReviewsToShow({
              ...reviewsToShow,
              [provider.id]: (reviewsToShow[provider.id] || 5) + 5,
            })
          }
          isSelected={selectedForComparison.includes(provider.id)}
          onToggleCompare={() => toggleComparison(provider.id)}
        />
      ))}
    </div>
  );
};
