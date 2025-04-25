"use client";

import type React from "react";
import { useState } from "react";
import { type ActivityFilterDto, ActivityType } from "@/types/activity";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Search, X } from "lucide-react";

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
    type: null,
    durationMin: null,
    durationMax: null,
    isAvailable: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: ActivityType) => {
    setFilters((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      type: null,
      durationMin: null,
      durationMax: null,
      isAvailable: null,
    });
    onClearFilters();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="search">Recherche</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="search"
            type="text"
            name="search"
            value={filters.search || ""}
            onChange={handleInputChange}
            className="pl-10"
            placeholder="Rechercher par nom ou mot-clé"
          />
        </div>
      </div>

      {/* Activity Types */}
      <div className="space-y-2">
        <Label>Type d'activité</Label>
        <RadioGroup
          value={filters.type || ""}
          onValueChange={handleTypeChange}
          className="grid grid-cols-1 gap-2"
        >
          {Object.values(ActivityType).map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <RadioGroupItem value={type} id={`type-${type}`} />
              <Label
                htmlFor={`type-${type}`}
                className="text-sm font-normal cursor-pointer"
              >
                {type.replace("_", " ")}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        {/* Duration Range */}
        <div className="space-y-2">
          <Label>Durée (heures)</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              name="durationMin"
              value={filters.durationMin || ""}
              onChange={handleInputChange}
              placeholder="Min"
              className="w-full"
            />
            <span className="text-gray-500">à</span>
            <Input
              type="number"
              name="durationMax"
              value={filters.durationMax || ""}
              onChange={handleInputChange}
              placeholder="Max"
              className="w-full"
            />
          </div>
        </div>

        {/* Availability Checkbox */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="isAvailable"
            checked={filters.isAvailable || false}
            onCheckedChange={(checked: boolean) =>
              setFilters((prev) => ({
                ...prev,
                isAvailable: checked === true ? true : null,
              }))
            }
          />
          <Label
            htmlFor="isAvailable"
            className="text-sm font-normal cursor-pointer"
          >
            Afficher uniquement les activités disponibles
          </Label>
        </div>
      </div>

      {/* Actions - Full width at the bottom */}
      <div className="col-span-full flex items-center justify-end space-x-4 mt-4">
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="flex items-center"
          type="button"
        >
          <X className="mr-2 h-4 w-4" /> Réinitialiser
        </Button>
        <Button
          onClick={handleApplyFilters}
          className="bg-purple hover:bg-secondarypurple"
          type="button"
        >
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
};
