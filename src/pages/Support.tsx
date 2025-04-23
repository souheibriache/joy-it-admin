import PageTitle from "@/components/PageTitle";
import React, { useState } from "react";
import {
  ColumnDef,
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
import { Eye } from "lucide-react";
import { ISupport, useGetAllSupportQuestions } from "@/utils/api/support-api";

type Props = {};

const Support = ({}: Props) => {
  return (
    <div className="p-6 flex flex-col gap-5">
      <PageTitle title="Support" />
      <SupportTable />
    </div>
  );
};

export default Support;

export const SupportTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Extract pagination and filter values from URL search parameters
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("take") || "10", 10);
  //   const [filters, setFilters] = useState({});

  // Fetch support questions using a custom hook
  const { supports, isLoading } = useGetAllSupportQuestions({
    page: currentPage,
    take: pageSize,
    // query: filters || {},
  });

  const columns: ColumnDef<ISupport>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => row.original.id.slice(0, 8),
    },
    {
      // Display the full name based on askedBy if present
      header: "Nom",
      cell: ({ row }) => {
        const support = row.original;
        return support.askedBy
          ? `${support.askedBy.firstName} ${support.askedBy.lastName}`
          : `${support.firstName} ${support.lastName}`;
      },
    },
    {
      // Display email from askedBy if available; otherwise, use support.email
      header: "Email",
      cell: ({ row }) => {
        const support = row.original;
        return support.askedBy && support.askedBy.email
          ? support.askedBy.email
          : support.email;
      },
    },
    {
      // Truncate the subject to 20 characters
      accessorKey: "subject",
      header: "Sujet",
      cell: ({ row }) => {
        const subject = row.original.subject || "";
        return subject.length > 20 ? subject.substring(0, 20) + "..." : subject;
      },
    },
    {
      accessorKey: "category",
      header: "Catégorie",
    },
    {
      accessorKey: "seenAt",
      header: "Vu le",
      cell: ({ row }) => {
        const seenAt = row.original.seenAt;
        return seenAt ? new Date(seenAt).toLocaleDateString("fr-FR") : "Non vu";
      },
    },
    {
      accessorKey: "answeredAt",
      header: "Répondu",
      cell: ({ row }) =>
        row.original.answeredAt ? (
          <span className="px-2 py-1 rounded bg-green-500 text-white text-sm">
            OUI
          </span>
        ) : (
          <span className="px-2 py-1 rounded bg-red-500 text-white text-sm">
            NON
          </span>
        ),
    },
    {
      accessorKey: "questionAttachments",
      header: "Pièces jointes",
      cell: ({ row }) =>
        row.original.questionAttachments
          ? row.original.questionAttachments.length
          : 0,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(`/support/${row.original.id}`)}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
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

  //   const handleApplyFilters = (newFilters: Record<string, any>) => {
  //     const cleanedFilters = Object.fromEntries(
  //       Object.entries(newFilters).filter(
  //         ([, value]) => value !== undefined && value !== ""
  //       )
  //     );
  //     setFilters(cleanedFilters);
  //     setSearchParams((prevParams) => {
  //       const params = new URLSearchParams(prevParams.toString());
  //       Object.entries(cleanedFilters).forEach(([key, value]) =>
  //         params.set(key, value.toString())
  //       );
  //       return params;
  //     });
  //   };

  //   const handleClearFilters = () => {
  //     setFilters({});
  //     setSearchParams({ page: "1", take: pageSize.toString() });
  //   };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Fermer" : "Filtres"}
        </Button>
      </div>
      <div>
        Filters a implementer
        {/* {showFilters && (
          <SupportFilter
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            filters={filters}
          />
        )} */}
      </div>
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
            {!isLoading && table.getRowModel().rows.length ? (
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
                  {isLoading ? "Chargement..." : "Aucun résultat trouvé."}
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
          disabled={currentPage >= (supports?.meta?.totalPages || 1)}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};
