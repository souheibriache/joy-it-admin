"use client";

import type { CompanyFilterDto } from "@/types/company";
import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Search, X } from "lucide-react";

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
  const [verificationStatus, setVerificationStatus] = useState<
    string | undefined
  >(undefined);

  // Initialize form with existing filters
  useEffect(() => {
    if (filters) {
      setName(filters.name || "");
      if (filters.isVerified !== undefined) {
        setVerificationStatus(filters.isVerified ? "verified" : "unverified");
      } else {
        setVerificationStatus(undefined);
      }
    }
  }, [filters]);

  const handleApplyFilters = () => {
    const isVerified =
      verificationStatus === "verified"
        ? true
        : verificationStatus === "unverified"
        ? false
        : undefined;

    onApplyFilters({ name, isVerified });
  };

  const handleClearFilters = () => {
    setName("");
    setVerificationStatus(undefined);
    onClearFilters();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Name Filter */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l'entreprise</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="name"
            type="text"
            placeholder="Rechercher par nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Verification Status */}
      <div className="space-y-2">
        <Label>Statut de vérification</Label>
        <RadioGroup
          value={verificationStatus}
          onValueChange={setVerificationStatus}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="font-normal cursor-pointer">
              Tous
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="verified" id="verified" />
            <Label htmlFor="verified" className="font-normal cursor-pointer">
              Vérifié
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unverified" id="unverified" />
            <Label htmlFor="unverified" className="font-normal cursor-pointer">
              Non vérifié
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Actions */}
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
