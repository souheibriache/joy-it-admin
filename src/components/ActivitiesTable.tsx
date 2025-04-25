"use client";

import type React from "react";
import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  useGetPaginatedActivities,
  useDeleteActivity,
} from "@/utils/api/activities-api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ActivityFilterDto, ActivityOptionsDto } from "@/types/activity";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Loader2,
  Plus,
  Trash,
} from "lucide-react";
import { ActivityFilter } from "./ActivirtFilter";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const ActivitiesTable: React.FC = () => {
  const [filters, setFilters] = useState<ActivityFilterDto>({});
  const [showFilters, setShowFilters] = useState(false);

  const [pagination, setPagination] = useState<ActivityOptionsDto>({
    page: 1,
    take: 10,
    ...filters,
  });

  const navigate = useNavigate();
  const { activities, isLoading } = useGetPaginatedActivities(pagination);

  const { mutate: deleteActivity, isLoading: isDeleting } = useDeleteActivity();

  const handleDelete = (activityId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      deleteActivity(activityId);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "mainImage",
      header: "Image",
      cell: ({ row }) => {
        let mainImage;
        mainImage = row.original.images?.find((image: any) => image.isMain);
        if (!mainImage) {
          mainImage = row.original?.images[0];
        }
        return mainImage ? (
          <img
            src={mainImage.fullUrl || "/placeholder.svg"}
            alt={row.original.originalName}
            className="h-10 w-10 rounded-md object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
            No Image
          </div>
        );
      },
    },
    {
      accessorKey: "city",
      header: "Ville",
      cell: ({ row }) => <div>{row.original.city || "—"}</div>,
    },
    {
      accessorKey: "duration",
      header: "Durée (hrs)",
      cell: ({ row }) => (
        <div className="text-center">{row.original.duration}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.type ? (
            <Badge
              variant="outline"
              className="bg-purple/10 text-purple text-xs"
            >
              {row.original.type}
            </Badge>
          ) : (
            "—"
          )}
        </div>
      ),
    },
    {
      accessorKey: "creditCost",
      header: "Crédits",
      cell: ({ row }) => (
        <div className="font-medium text-center">{row.original.creditCost}</div>
      ),
    },
    {
      accessorKey: "isAvailable",
      header: "Disponibilité",
      cell: ({ row }: { row: any }) =>
        row.original.isAvailable ? (
          <Badge className="bg-green-500 hover:bg-green-600">Disponible</Badge>
        ) : (
          <Badge variant="destructive">Indisponible</Badge>
        ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-purple"
            onClick={() => navigate("/activities/" + row?.original.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
            onClick={() => handleDelete(row.original.id)}
            disabled={isDeleting}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: activities?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: activities?.meta?.totalPages || 0,
  });

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleApplyFilters = (newFilters: ActivityFilterDto) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
    setFilters(cleanedFilters);
    setPagination((prev) => ({ ...prev, ...cleanedFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setPagination((prev) => ({
      page: 1,
      take: prev.take,
      search: "",
      type: null,
      durationMin: null,
      durationMax: null,
      isAvailable: null,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
        </Button>

        <Button
          onClick={() => navigate("/activities/new-activity")}
          className="bg-purple hover:bg-secondarypurple text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter une activité
        </Button>
      </div>

      {showFilters && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filtres</CardTitle>
            <CardDescription>
              Filtrer les activités selon vos critères
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFilter
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50 hover:bg-gray-50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!isLoading && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 text-purple animate-spin mr-2" />
                      Chargement des activités...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                      <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">
                        Aucune activité trouvée
                      </p>
                      <p className="text-sm">
                        Essayez de modifier vos filtres ou d'ajouter une
                        nouvelle activité
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {activities?.meta?.totalItems ? (
            <span>
              Affichage de {(pagination.page - 1) * pagination.take + 1} à{" "}
              {Math.min(
                pagination.page * pagination.take,
                activities.meta.totalItems
              )}{" "}
              sur {activities.meta.totalItems} activités
            </span>
          ) : (
            <span>0 activité</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!activities?.meta?.hasPreviousPage}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!activities?.meta?.hasNextPage}
            className="flex items-center gap-1"
          >
            Suivant <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesTable;
