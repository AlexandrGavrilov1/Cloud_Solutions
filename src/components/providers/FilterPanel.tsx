// FilterPanel.tsx (фрагмент с чекбоксами)

{
  /* Чекбоксы для булевых фильтров */
}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
    <div className="relative">
      <input
        type="checkbox"
        id="fz152"
        checked={filterFZ152}
        onChange={(e) => setFilterFZ152(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-4 h-4 rounded-md border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
        {filterFZ152 && (
          <Icon name="Check" size={10} className="text-background" />
        )}
      </div>
    </div>
    <label htmlFor="fz152" className="flex items-center gap-2 cursor-pointer">
      <Icon name="ShieldCheck" size={16} className="text-primary" />
      <span className="font-medium text-foreground">152-ФЗ</span>
    </label>
  </div>

  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
    <div className="relative">
      <input
        type="checkbox"
        id="fstek"
        checked={filterFSTEK}
        onChange={(e) => setFilterFSTEK(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-4 h-4 rounded-md border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
        {filterFSTEK && (
          <Icon name="Check" size={10} className="text-background" />
        )}
      </div>
    </div>
    <label htmlFor="fstek" className="flex items-center gap-2 cursor-pointer">
      <Icon name="ShieldAlert" size={16} className="text-primary" />
      <span className="font-medium text-foreground">ФСТЕК</span>
    </label>
  </div>

  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
    <div className="relative">
      <input
        type="checkbox"
        id="trial"
        checked={filterTrialPeriod}
        onChange={(e) => setFilterTrialPeriod(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-5 h-5 rounded-md border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
        {filterTrialPeriod && (
          <Icon name="Check" size={12} className="text-background" />
        )}
      </div>
    </div>
    <label htmlFor="trial" className="flex items-center gap-2 cursor-pointer">
      <Icon name="Gift" size={16} className="text-primary" />
      <span className="font-medium text-foreground">
        {t("filters.trialPeriod")}
      </span>
    </label>
  </div>
</div>;
