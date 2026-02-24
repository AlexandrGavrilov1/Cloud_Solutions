<article className="pt-32 pb-16">
  {/* Убран внутренний div с max-w-4xl, контент теперь непосредственно во внешнем контейнере */}
  <div className="container mx-auto px-4 lg:px-[3.5cm]">
    {/* Кнопка возврата */}
    <Link
      to="/vpn"
      className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-8"
    >
      <Icon name="ArrowLeft" size={20} />
      <span className="font-semibold">Вернуться к разделу VPN</span>
    </Link>

    {/* Заголовок статьи */}
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight text-left">
      {/* ... */}
    </h1>

    {/* Краткое описание */}
    <p className="text-lg text-muted-foreground mb-6 text-left">{/* ... */}</p>

    {/* Тонкая линия */}
    <hr className="border-t border-border/50 my-6" />

    {/* Метаданные */}
    <div className="flex items-center gap-6 text-sm text-foreground mb-8">
      {/* ... */}
    </div>

    {/* Изображение статьи */}
    {post.image && (
      <div className="w-full mb-12">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto rounded-2xl shadow-lg"
        />
      </div>
    )}

    {/* Контент */}
    <div data-color-mode={theme === "dark" ? "dark" : "light"}>
      <MDEditor.Markdown
        source={post.content}
        components={{
          img({ node, ...props }) {
            return (
              <a href={props.src} target="_blank" rel="noopener noreferrer">
                <img {...props} />
              </a>
            );
          },
        }}
      />
    </div>

    {/* Теги */}
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag, idx) => (
          <Badge key={idx} variant="outline" className="text-sm">
            #{tag}
          </Badge>
        ))}
      </div>
    </div>

    {/* Кнопка провайдера */}
    {post.providerUrl && post.providerName && (
      <div className="mt-8 text-center">
        <Button
          asChild
          className="bg-primary text-background font-bold shadow-lg shadow-primary/30 px-8 py-6 text-lg hover:bg-primary/90 transition-all"
        >
          <a
            href={post.providerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleProviderClick}
          >
            Перейти на {post.providerName}
          </a>
        </Button>
      </div>
    )}
  </div>
</article>;
