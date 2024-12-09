import React, { useState } from "react";
import { ActivityFilterDto, ActivityType } from "@/types/activity";

interface ActivityFilterProps {
  onApplyFilters: (filters: ActivityFilterDto) => void;
  onClearFilters: () => void;
}

export const ActivityFilter: React.FC<ActivityFilterProps> = ({
  onApplyFilters,
  onClearFilters,
}) => {
  const [filters, setFilters] = useState<ActivityFilterDto>({
    search: "",
    types: [],
    durationMin: undefined,
    durationMax: undefined,
    isAvailable: undefined,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type: ActivityType) => {
    setFilters((prev) => {
      const types = prev.types || [];
      const updatedTypes = types.includes(type)
        ? types.filter((t) => t !== type)
        : [...types, type];
      return { ...prev, types: updatedTypes };
    });
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFilters((prev) => ({ ...prev, isAvailable: checked }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      types: [],
      durationMin: undefined,
      durationMax: undefined,
      isAvailable: undefined,
    });
    onClearFilters();
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md space-y-4">
      <h2 className="text-xl font-bold">Filtres</h2>

      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Recherche
        </label>
        <input
          type="text"
          name="search"
          value={filters.search || ""}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Rechercher par nom ou mot-clé"
        />
      </div>

      {/* Activity Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Types d'activités
        </label>
        <div className="mt-2 space-y-2">
          {Object.values(ActivityType).map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.types?.includes(type) || false}
                onChange={() => handleCheckboxChange(type)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration Range */}
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Durée Min (heures)
          </label>
          <input
            type="number"
            name="durationMin"
            value={filters.durationMin || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Durée Max (heures)
          </label>
          <input
            type="number"
            name="durationMax"
            value={filters.durationMax || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Availability Checkbox */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isAvailable || false}
            onChange={handleAvailabilityChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Afficher uniquement les activités disponibles
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Appliquer
        </button>
        <button
          onClick={handleClearFilters}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};
