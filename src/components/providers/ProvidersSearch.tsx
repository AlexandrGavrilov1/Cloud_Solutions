<div className="relative w-full sm:w-64 md:w-80">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Найти провайдера..."
              className="w-full pl-10 md:pl-12 pr-10 md:pr-12 h-10 md:h-12 bg-background border-2 border-border rounded-lg md:rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs md:text-sm text-foreground placeholder:text-muted-foreground font-semibold hover:border-primary/50 hover:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-accent rounded-lg transition-colors"
              >
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>