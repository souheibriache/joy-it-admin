import React, { useEffect, useState } from "react";
import {
  ColumnDef,
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
import { ActivityFilterDto, ActivityOptionsDto } from "@/types/activity";
import { useNavigate } from "react-router-dom";
import { Eye, Plus, Trash } from "lucide-react";
import { ActivityFilter } from "./ActivirtFilter";

const ActivitiesTable: React.FC = () => {
  const [filters, setFilters] = useState<ActivityFilterDto>({});
  const [showFilters, setShowFilters] = useState(false);

  const [pagination, setPagination] = useState<ActivityOptionsDto>({
    page: 1,
    take: 10,
    query: filters,
  });

  const navigate = useNavigate();
  const { activities, isLoading } = useGetPaginatedActivities(pagination);

  const { mutate: deleteActivity, isLoading: isDeleting } = useDeleteActivity();

  const handleDelete = (activityId: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      deleteActivity(activityId);
    }
  };

  useEffect(() => {
    console.log({ activities });
  }, [activities]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: "mainImage",
      header: "Main Image",
      cell: ({ row }) => {
        let mainImage;
        mainImage = row.original.images?.find((image: any) => image.isMain);
        if (!mainImage) {
          mainImage = row.original?.images[0];
        }
        return mainImage ? (
          <img
            src={mainImage.fullUrl}
            alt={row.original.originalName}
            className="h-10 w-10 rounded"
          />
        ) : (
          "No Image"
        );
      },
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => <div>{row.original.city}</div>,
    },
    {
      accessorKey: "duration",
      header: "Duration (hrs)",
      cell: ({ row }) => <div>{row.original.duration}</div>,
    },
    {
      accessorKey: "types",
      header: "Types",
      cell: ({ row }) => (
        <div>{row.original.types?.join(", ") || "No Types"}</div>
      ),
    },
    {
      accessorKey: "creditCost",
      header: "Credit Cost",
      cell: ({ row }) => <div>{row.original.creditCost}</div>,
    },
    {
      accessorKey: "isAvailable",
      header: "Disponibilité",
      cell: ({ row }: { row: any }) =>
        row.original.isAvailable ? (
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
            onClick={() => navigate("/activities/" + row?.original.id)}
          >
            <Eye className="p-0.5" />
          </button>{" "}
          <button
            className="bg-red-500 text-white  p-1 rounded"
            onClick={() => handleDelete(row.original.id)}
            disabled={isDeleting}
          >
            <Trash className="p-0.5" />
          </button>{" "}
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
    setPagination((prev) => ({ ...prev, query: cleanedFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setPagination((prev) => ({ ...prev, query: {}, page: 1 }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Fermer" : "Filters"}
        </Button>
        <Button
          onClick={() => navigate("/activities/new-activity")}
          className="bg-purple text-white px-4 py-2 rounded-md hover:bg-secondarypurple"
        >
          <Plus /> Ajouter
        </Button>
      </div>

      {showFilters && (
        <ActivityFilter
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />
      )}

      <div className="mt-6">
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
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!activities?.meta?.hasPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!activities?.meta?.hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesTable;
