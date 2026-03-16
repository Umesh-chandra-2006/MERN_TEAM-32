import { useState, useEffect } from "react";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";
import axios from "axios";

function UserDashboard() {
  const currentUser = useAuth().currentUser;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function getArticles() {
      setLoading(true);
      try {
        let res = await axios.get("http://localhost:3000/user-api/articles", {
          withCredentials: true,
        });
        console.log("Response object is: ", res);
        if (res.status === 200) {
          let article = await res.data;
          setArticles(article.articles);
          console.log("Articles fetched: ", article);
        } else {
          throw new Error("Unable to fetch articles");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getArticles();
  }, []);

  const gotoArticle = (articleObj) => {
    //while navigating transfer article obj too
    navigate("/article", { state: { article: articleObj } });
  };

  console.log("Articles fetched: ", articles);

  if (loading) {
    return <div className="text-center p-4">Adding user...</div>;
  }
  if (error !== null) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      <p>Welcome, {currentUser.firstName}!</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Your Articles</h2>
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ">
          {articles.map((article) => {
            return (
              <div
                key={article.id}
                onClick={() => gotoArticle(article)}
                className="border-2 border-gray-500 p-5 m-5 rounded-2xl shadow-lg cursor-pointer "
              >
                <h1 className="text-lg font-semibold items-center">
                  {article.title}
                </h1>
                <h1 className="text-lg font-semibold items-center">
                  {article.author.firstName}
                </h1>
                <h1 className="text-lg font-semibold items-center">
                  {article.category}
                </h1>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default UserDashboard;