// В начале файла добавляем:
const [filterClientTypes, setFilterClientTypes] = useState<string[]>(() => {
  const saved = localStorage.getItem("filterClientTypes");
  return saved ? JSON.parse(saved) : [];
});

// В useMemo для filteredProviders добавляем фильтрацию по типам клиентов:
const filteredProviders = useMemo(
  () =>
    providersWithReviews
      .filter((p) => {
        // ... другие фильтры

        // Типы клиентов (мульти-выбор)
        if (filterClientTypes.length > 0) {
          const hasMatchingClientType = filterClientTypes.some(
            (type) => p.clientTypes?.includes(type) || false,
          );
          if (!hasMatchingClientType) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // ... сортировка
      }),
  [
    // ... другие зависимости
    filterClientTypes,
  ],
);

// В useEffect добавляем сохранение фильтра:
useEffect(() => {
  if (filterClientTypes.length > 0) {
    localStorage.setItem(
      "filterClientTypes",
      JSON.stringify(filterClientTypes),
    );
  } else {
    localStorage.removeItem("filterClientTypes");
  }
}, [filterClientTypes]);

// В clearFilters добавляем очистку фильтра:
const clearFilters = () => {
  // ... очистка других фильтров
  setFilterClientTypes([]);
};

// В компонентах FilterPanel добавляем пропсы:
<FilterPanel
  // ... другие пропсы
  filterClientTypes={filterClientTypes}
  setFilterClientTypes={setFilterClientTypes}
  clientTypeOptions={["Физлицо", "Самозанятый", "ИП", "Юрлицо"]}
/>;
