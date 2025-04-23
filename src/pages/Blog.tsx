"use client";

import type React from "react";

import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useDeleteArticle, useGetArticles } from "@/utils/api/blog-api";
import {
  AlertCircle,
  Calendar,
  Edit,
  Loader2,
  Plus,
  Trash,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Blog" />

        <Button
          onClick={() => navigate("/blog/create-new")}
          className="bg-purple hover:bg-secondarypurple text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Créer un article
        </Button>
      </div>

      {/* Search and filters placeholder */}
      <Card className="bg-gray-50 border border-gray-200">
        <CardContent className="p-4">
          <p className="text-gray-600">Filtres et recherche (à venir...)</p>
        </CardContent>
      </Card>

      {articles?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles?.map((article: any) => (
            <Card
              key={article.id}
              className="overflow-hidden flex flex-col h-full border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                {article.thumbnail ? (
                  <img
                    src={article.thumbnail.fullUrl || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Pas d'image</span>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl line-clamp-2">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {article.subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-1 mb-3">
                  {article.tags?.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-purple/10 text-purple text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>
                      {article.author
                        ? `${article.author.firstName} ${article.author.lastName}`
                        : "Inconnu"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </CardContent>

              <Separator />

              <CardFooter className="flex justify-between p-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(article.id);
                  }}
                >
                  <Trash className="h-4 w-4 mr-1" /> Supprimer
                </Button>

                <Link to={`/blog/${article.id}`}>
                  <Button
                    size="sm"
                    className="bg-purple hover:bg-secondarypurple"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Modifier
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500 py-16 bg-white rounded-lg border border-gray-200">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">Aucun article disponible</h3>
          <p className="text-gray-500 mb-6">
            Commencez par créer votre premier article de blog
          </p>
          <Button
            onClick={() => navigate("/blog/create-new")}
            className="bg-purple hover:bg-secondarypurple"
          >
            <Plus className="h-4 w-4 mr-2" /> Créer un article
          </Button>
        </div>
      )}
    </div>
  );
};

export default Blog;
