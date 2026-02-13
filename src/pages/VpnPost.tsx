import { useParams, Navigate } from "react-router-dom";
import { Header } from "@/components/providers/Header";
import { Footer } from "@/components/providers/Footer";
import { vpnPosts } from "@/data/vpn-posts";

const VpnPost = () => {
  const { slug } = useParams();
  const post = vpnPosts.find((p) => p.slug === slug);
  if (!post) return <Navigate to="/vpn" />;
  return (
    <div>
      <Header />
      <main
        style={{
          paddingTop: "8rem",
          paddingBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </main>
      <Footer />
    </div>
  );
};

export default VpnPost;
