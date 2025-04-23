import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Replace with your actual button component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Replace with your actual table components
import { useGetPaginatedCompanies } from "@/utils/api/companies-api";
import { CompanyFilterDto, ICompany } from "@/types/company";
import { Eye } from "lucide-react";
import { CompanyFilter } from "./CompanyFilters";

export const CompaniesTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  // Extracting query params
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("take") || "10", 10);
  const [filters, setFilters] = useState<CompanyFilterDto>({});

  // Fetching data from the hook
  const { companies, isLoading } = useGetPaginatedCompanies({
    page: currentPage,
    take: pageSize,
    query: filters || {},
  });

  const columns: ColumnDef<ICompany>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }: { row: any }) => row.original.id.split("-")[0],
    },
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "logo.fullUrl",
      header: "Logo",
      cell: ({ row }: { row: any }) => (
        <img
          src={row.original.logo?.fullUrl || ""}
          alt={row.original.name}
          className="h-10 w-10 rounded"
        />
      ),
    },
    {
      accessorKey: "city",
      header: "Ville",
    },
    {
      accessorKey: "employeesNumber",
      header: "Taille",
      cell: ({ row }: { row: any }) => row.original.employeesNumber,
    },
    {
      accessorKey: "credit",
      header: "Credit",
      cell: ({ row }: { row: any }) => row.original.credit,
    },
    {
      accessorKey: "client.email",
      header: "Email",
      cell: ({ row }: { row: any }) => row.original.client?.email || "N/A",
    },
    {
      accessorKey: "subscription.plan.name",
      header: "Abonnement",
      cell: ({ row }: { row: any }) =>
        row.original.subscription?.plan?.name || "N/A",
    },

    {
      accessorKey: "isVerified",
      header: "Verifié",
      cell: ({ row }: { row: any }) =>
        row.original.isVerified ? (
          <span className="p-2 rounded bg-green-500 text-white font-semibold text-sm">
            OUI
          </span>
        ) : (
          <span className="p-2 rounded bg-red-500 text-white font-semibold text-sm">
            NON
          </span>
        ),
    },
    {
      accessorKey: "subscription.plan.name",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex flex-row items-center gap-2">
          <button
            className="bg-purple text-white  p-1 rounded"
            onClick={() => navigate("/clients/" + row?.original.id)}
          >
            <Eye className="p-0.5" />
          </button>
        </div>
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
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Fermer" : "Filtres"}
        </Button>
      </div>
      {showFilters && (
        <CompanyFilter
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          filters={filters}
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                <TableRow key={row.id}>
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
                  {isLoading ? "Loading..." : "No results found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= (companies?.meta?.totalPages || 1)}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};
