import { useParams, Navigate } from "react-router-dom";
import { Header } from "@/components/providers/Header";
import { Footer } from "@/components/providers/Footer";
import { vpnPosts } from "@/data/vpn-posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const VpnPost = () => {
  const { slug } = useParams();
  const post = vpnPosts.find((p) => p.slug === slug);
  if (!post) return <Navigate to="/vpn" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-16 container mx-auto px-4">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="prose prose-lg max-w-none mt-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VpnPost;
