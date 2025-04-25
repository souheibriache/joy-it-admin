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
import { useGetPaginatedCompanies } from "@/utils/api/companies-api";
import type { CompanyFilterDto, ICompany } from "@/types/company";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Loader2,
} from "lucide-react";
import { CompanyFilter } from "./CompanyFilters";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const CompaniesTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  // Extracting query params
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const pageSize = Number.parseInt(searchParams.get("take") || "10", 10);
  const [filters, setFilters] = useState<CompanyFilterDto>({});

  // Fetching data from the hook
  const { companies, isLoading } = useGetPaginatedCompanies({
    page: currentPage,
    take: pageSize,
    ...filters,
  });

  const columns: ColumnDef<ICompany>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }: { row: any }) => (
        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {row.original.id.split("-")[0]}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "logo.fullUrl",
      header: "Logo",
      cell: ({ row }: { row: any }) =>
        row.original.logo?.fullUrl ? (
          <img
            src={row.original.logo?.fullUrl || "/placeholder.svg"}
            alt={row.original.name}
            className="h-10 w-10 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
            {row.original.name.charAt(0)}
          </div>
        ),
    },
    {
      accessorKey: "city",
      header: "Ville",
      cell: ({ row }: { row: any }) => <div>{row.original.city || "—"}</div>,
    },
    {
      accessorKey: "employeesNumber",
      header: "Taille",
      cell: ({ row }: { row: any }) => (
        <Badge variant="outline" className="bg-gray-100">
          {row.original.employeesNumber} employés
        </Badge>
      ),
    },
    {
      accessorKey: "credit",
      header: "Crédits",
      cell: ({ row }: { row: any }) => (
        <div className="font-medium text-center">{row.original.credit}</div>
      ),
    },
    {
      accessorKey: "client.email",
      header: "Email",
      cell: ({ row }: { row: any }) => (
        <div className="text-sm truncate max-w-[200px]">
          {row.original.client?.email || "—"}
        </div>
      ),
    },
    {
      accessorKey: "subscription.plan.name",
      header: "Abonnement",
      cell: ({ row }: { row: any }) =>
        row.original.subscription?.plan?.name ? (
          <Badge className="bg-purple/10 text-purple border-purple/20">
            {row.original.subscription?.plan?.name}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-500">
            Aucun
          </Badge>
        ),
    },
    {
      accessorKey: "isVerified",
      header: "Vérifié",
      cell: ({ row }: { row: any }) =>
        row.original.isVerified ? (
          <Badge className="bg-green-500 hover:bg-green-600">Vérifié</Badge>
        ) : (
          <Badge variant="destructive">Non vérifié</Badge>
        ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 text-purple"
          onClick={() => navigate("/clients/" + row?.original.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: companies?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: companies?.meta?.totalPages || 0,
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams.toString());
      params.set("page", newPage.toString());
      params.set("take", pageSize.toString());
      return params;
    });
  };

  const handleApplyFilters = (newFilters: CompanyFilterDto) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    setFilters(cleanedFilters);
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams.toString());
      Object.entries(cleanedFilters).forEach(([key, value]) =>
        params.set(key, value.toString())
      );
      return params;
    });
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchParams({ page: "1", take: pageSize.toString() });
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
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filtres</CardTitle>
            <CardDescription>
              Filtrer les clients selon vos critères
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyFilter
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              filters={filters}
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
                      Chargement des clients...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                      <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">Aucun client trouvé</p>
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
          {companies?.meta?.totalItems ? (
            <span>
              Affichage de {(currentPage - 1) * pageSize + 1} à{" "}
              {Math.min(currentPage * pageSize, companies.meta.totalItems)} sur{" "}
              {companies.meta.totalItems} clients
            </span>
          ) : (
            <span>0 client</span>
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
            disabled={currentPage >= (companies?.meta?.totalPages || 1)}
            className="flex items-center gap-1"
          >
            Suivant <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
