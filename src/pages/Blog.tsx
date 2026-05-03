import { useState } from 'react';
import { Header } from '@/components/providers/Header';
import { Footer } from '@/components/providers/Footer';
import { OpenGraph } from '@/components/SEO/OpenGraph';
import { StructuredData } from '@/components/SEO/StructuredData';
import { blogPosts, blogCategories } from '@/data/blog-posts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Все' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <OpenGraph 
        title="Блог о VPS хостинге — Гайды, сравнения и советы"
        description="Полезные статьи о VPS хостинге: как выбрать провайдера, настроить сервер, оптимизировать производительность и защитить от DDoS атак."
        url="https://top-vds.ru/blog"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Главная', url: 'https://top-vds.ru' },
          { name: 'Блог', url: 'https://top-vds.ru/blog' }
        ]} 
      />
      <Header />
      
      <main>
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[120px]"></div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent border border-primary/30 rounded-full px-5 py-2.5">
                <Icon name="BookOpen" size={16} className="text-primary" />
                <span className="text-sm font-bold text-primary">Блог о VPS хостинге</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-tight">
                База знаний по VPS
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Руководства, сравнения и советы по выбору и настройке VPS хостинга
              </p>

              <div className="relative max-w-xl mx-auto">
                <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск по статьям..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-card border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {blogCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="FileQuestion" size={64} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">Статьи не найдены</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Все');
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group"
                  >
                    <article className="bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg h-full flex flex-col">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon name="FileText" size={64} className="text-primary/30" />
                        </div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                            {post.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{post.readTime}</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Icon name="Eye" size={12} />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-1 text-primary font-semibold text-sm">
                            Читать
                            <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                        
                        <div className="mt-3 text-xs text-muted-foreground">
                          {post.date}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;