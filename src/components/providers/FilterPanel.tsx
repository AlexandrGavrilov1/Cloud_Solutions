<div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
  <div className="relative">
    <input
      type="checkbox"
      id="fz152"
      checked={filterFZ152}
      onChange={(e) => setFilterFZ152(e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-6 h-6 rounded-md border-2 border-primary peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
      {filterFZ152 && (
        <Icon name="Check" size={16} className="text-background" />
      )}
    </div>
  </div>
  <label htmlFor="fz152" className="flex items-center gap-2 cursor-pointer">
    <Icon name="ShieldCheck" size={18} className="text-primary" />
    <span className="font-medium text-foreground">ФЗ-152</span>
  </label>
</div>;
