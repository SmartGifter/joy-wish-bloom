
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import Auth from "@/components/Auth";

const Signup = () => {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <Layout>
      <div className="max-w-md mx-auto py-10">
        <Auth initialTab="signup" onComplete={() => navigate("/")} />
      </div>
    </Layout>
  );
};

export default Signup;
