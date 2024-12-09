import { CompanyFilterDto } from "@/types/company";
import React, { useState } from "react";

export interface CompanyFilters {
  name?: string;
  isVerified?: boolean;
}

interface CompanyFilterProps {
  onApplyFilters: (filters: CompanyFilters) => void;
  onClearFilters: () => void;
  filters: CompanyFilterDto | null;
}

export const CompanyFilter: React.FC<CompanyFilterProps> = ({
  onApplyFilters,
  onClearFilters,
  filters,
}) => {
  const [name, setName] = useState("");
  const [isVerified, setIsVerified] = useState<boolean | undefined>();

  const handleApplyFilters = () => {
    onApplyFilters({ name, isVerified });
  };

  const handleClearFilters = () => {
    setName("");
    setIsVerified(undefined);
    onClearFilters();
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      {/* Name Filter */}
      <input
        type="text"
        placeholder="Nom de l'entreprise"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Verified Checkbox */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isVerified === true}
            onChange={() => setIsVerified(true)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span>Verifié</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isVerified === false}
            onChange={() => setIsVerified(false)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span>Non verifié</span>
        </label>
      </div>

      {/* Buttons */}
      <button
        disabled={filters === null}
        onClick={handleApplyFilters}
        className="bg-blue-600 text-white px-4 py-2 disabled:opacity-80 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Appliquer
      </button>
      <button
        onClick={handleClearFilters}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        Clearer
      </button>
    </div>
  );
};
