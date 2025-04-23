import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useDeleteArticle, useGetArticles } from "@/utils/api/blog-api";
import { Loader, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Helper to truncate text
const truncate = (text: string, limit: number) =>
  text.length <= limit ? text : text.substring(0, limit) + "...";

const Blog: React.FC = () => {
  const { data: articles, isLoading } = useGetArticles();
  const deleteArticleMutation = useDeleteArticle();
  const navigate = useNavigate();
  const handleDelete = (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      deleteArticleMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        Chargement...
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-5">
      <PageTitle title="Blog" />
      {/* Filters placeholder */}
      <div className="flex flex-row gap-5 w-full ">
        <div className="bg-gray-100 p-4 rounded shadow mb-6 w-full">
          <p className="text-gray-600">Filtres (à venir...)</p>
        </div>

        <Button
          className="bg-purple"
          onClick={() => navigate("/blog/create-new")}
        >
          <Plus /> Créer
        </Button>
      </div>

      {articles?.length || isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles?.map((article: any) => (
            <div
              key={article.id}
              className="bg-white rounded shadow p-4 flex flex-col"
            >
              <Link
                to={`/blog/${article.id}`}
                className="flex flex-col flex-grow"
              >
                {article.thumbnail && (
                  <img
                    src={article.thumbnail.fullUrl}
                    alt={article.title}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  {truncate(article.subtitle, 100)}
                </p>
              </Link>
              <div className="flex justify-between items-center mt-auto">
                <div className="text-sm text-gray-500">
                  {article.author
                    ? `${article.author.firstName} ${article.author.lastName}`
                    : "Inconnu"}
                  <br />
                  <span>
                    {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                  <Link to={`/blog/${article.id}`}>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Modifier
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <div className="w-full flex items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <h5 className="w-full text-center">La liste des articles est vide</h5>
      )}
    </div>
  );
};

export default Blog;
