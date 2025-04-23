"use client";

import PageTitle from "@/components/PageTitle";
import type React from "react";
import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Loader2,
} from "lucide-react";
import {
  type ISupport,
  useGetAllSupportQuestions,
} from "@/utils/api/support-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Support = () => {
  return (
    <div className="space-y-6">
      <PageTitle title="Support" />

      <Card>
        <CardContent className="p-6">
          <SupportTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;

export const SupportTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Extract pagination and filter values from URL search parameters
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const pageSize = Number.parseInt(searchParams.get("take") || "10", 10);

  // Fetch support questions using a custom hook
  const { supports, isLoading } = useGetAllSupportQuestions({
    page: currentPage,
    take: pageSize,
  });

  const columns: ColumnDef<ISupport>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {row.original.id.slice(0, 8)}
        </span>
      ),
    },
    {
      // Display the full name based on askedBy if present
      header: "Nom",
      cell: ({ row }) => {
        const support = row.original;
        return (
          <div className="font-medium">
            {support.askedBy
              ? `${support.askedBy.firstName} ${support.askedBy.lastName}`
              : `${support.firstName} ${support.lastName}`}
          </div>
        );
      },
    },
    {
      // Display email from askedBy if available; otherwise, use support.email
      header: "Email",
      cell: ({ row }) => {
        const support = row.original;
        return (
          <div className="text-sm truncate max-w-[200px]">
            {support.askedBy && support.askedBy.email
              ? support.askedBy.email
              : support.email}
          </div>
        );
      },
    },
    {
      // Truncate the subject to 20 characters
      accessorKey: "subject",
      header: "Sujet",
      cell: ({ row }) => {
        const subject = row.original.subject || "";
        return (
          <div className="font-medium">
            {subject.length > 30 ? subject.substring(0, 30) + "..." : subject}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Catégorie",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "seenAt",
      header: "Vu le",
      cell: ({ row }) => {
        const seenAt = row.original.seenAt;
        return seenAt ? (
          <div className="text-sm">
            {new Date(seenAt).toLocaleDateString("fr-FR")}
          </div>
        ) : (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-200"
          >
            Non vu
          </Badge>
        );
      },
    },
    {
      accessorKey: "answeredAt",
      header: "Répondu",
      cell: ({ row }) =>
        row.original.answeredAt ? (
          <Badge className="bg-green-500 hover:bg-green-600">Répondu</Badge>
        ) : (
          <Badge variant="destructive">En attente</Badge>
        ),
    },
    {
      accessorKey: "questionAttachments",
      header: "Pièces jointes",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.questionAttachments &&
          row.original.questionAttachments.length > 0 ? (
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 border-blue-200"
            >
              {row.original.questionAttachments.length}
            </Badge>
          ) : (
            <span className="text-gray-400">0</span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 text-purple"
          onClick={() => navigate(`/support/${row.original.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: supports?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: supports?.meta?.totalPages || 0,
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams.toString());
      params.set("page", newPage.toString());
      params.set("take", pageSize.toString());
      return params;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
        </Button>
      </div>

      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Filtres à implémenter</p>
        </div>
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
            {!isLoading && table.getRowModel().rows.length ? (
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
                      Chargement des demandes de support...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                      <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">
                        Aucune demande de support trouvée
                      </p>
                      <p className="text-sm">Essayez de modifier vos filtres</p>
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
          {supports?.meta?.totalItems ? (
            <span>
              Affichage de {(currentPage - 1) * pageSize + 1} à{" "}
              {Math.min(currentPage * pageSize, supports.meta.totalItems)} sur{" "}
              {supports.meta.totalItems} demandes
            </span>
          ) : (
            <span>0 demande</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= (supports?.meta?.totalPages || 1)}
            className="flex items-center gap-1"
          >
            Suivant <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
