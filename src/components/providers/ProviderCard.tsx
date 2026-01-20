// В ProviderCardHeader компонент добавьте:
interface ProviderCardHeaderProps {
  provider: Provider;
  index: number;
  calculatedPrice: number;
  onProviderClick: () => void;
}

export const ProviderCardHeader = ({
  provider,
  index,
  calculatedPrice,
  onProviderClick,
}: ProviderCardHeaderProps) => {
  // ... существующий код ...

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* ... существующий код ... */}

          {/* Иконки 152-ФЗ и ФСТЭК в заголовке */}
          <div className="flex gap-1">
            {provider.fz152Compliant && (
              <div className="w-5 h-5 bg-primary/20 rounded-md flex items-center justify-center">
                <Icon name="ShieldCheck" size={10} className="text-primary" />
              </div>
            )}

            {provider.fstekCertifications &&
              provider.fstekCertifications.length > 0 && (
                <div className="w-5 h-5 bg-secondary/20 rounded-md flex items-center justify-center">
                  <Icon
                    name="ShieldAlert"
                    size={10}
                    className="text-secondary"
                  />
                </div>
              )}
          </div>
        </div>

        {/* ... остальной код ... */}
      </div>

      {/* ... остальной код ... */}
    </div>
  );
};
