import { useParams, Navigate } from "react-router-dom";
import { Header } from "@/components/providers/Header";
import { Footer } from "@/components/providers/Footer";
import { vpnPosts } from "@/data/vpn-posts";

const VpnPost = () => {
  const { slug } = useParams();
  const post = vpnPosts.find((p) => p.slug === slug);
  if (!post) return <Navigate to="/vpn" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-16 container mx-auto px-4">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <pre className="whitespace-pre-wrap mt-8">{post.content}</pre>
      </main>
      <Footer />
    </div>
  );
};

export default VpnPost;
