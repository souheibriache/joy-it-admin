import React, { useState } from "react";
import PageTitle from "@/components/PageTitle";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetCompanyById, useUpdateCompany } from "@/utils/api/companies-api";
import { ICompany } from "@/types/company";

const ClientDetails: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { company, isLoading } = useGetCompanyById(companyId || "");
  const { mutate: updateCompany, isLoading: isUpdating } = useUpdateCompany();

  const [formData, setFormData] = useState<Partial<ICompany>>({});

  // Update local state when company data changes
  React.useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    if (companyId) {
      const {
        id,
        createdAt,
        updatedAt,
        deletedAt,
        credit,
        client,
        subscription,
        logo,
        serviceOrders,
        ...rest
      } = formData as any;

      updateCompany({ companyId, data: rest });
    }
  };

  if (isLoading) {
    return <div>Loading company details...</div>;
  }

  if (!company) {
    return <div>Company not found.</div>;
  }

  const { client } = company;

  return (
    <div className="p-6">
      {/* Page Title */}
      <PageTitle title={"Clients"} breadCump={[company.name]} />

      {/* Company Details Form */}
      <form className="mt-6 bg-white p-4 rounded-md shadow-md space-y-4">
        <h2 className="text-xl font-bold mb-4">Détails de l'entreprise</h2>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <textarea
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Code postale
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ville
          </label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Numéro de téléphone
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Employees Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Taille de l'entreprise
          </label>
          <input
            type="number"
            name="employeesNumber"
            value={formData.employeesNumber || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Is Verified */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isVerified"
            checked={formData.isVerified || false}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm font-medium text-gray-700">
            Verifié
          </label>
        </div>

        {/* Subscription Plan Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Abonnement
          </label>
          <input
            type="text"
            value={formData.subscription?.plan?.name || "Pas de plan"}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-purple text-white px-4 py-2 rounded-md hover:bg-secondarypurple focus:outline-none focus:ring-2 focus:ring-purple"
          >
            {isUpdating ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>

      {/* Client Details Section */}
      {client && (
        <div className="mt-6 bg-white p-4 rounded-md shadow-md space-y-4">
          <h2 className="text-xl font-bold mb-4">Détails du client</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              value={client.firstName || ""}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              value={client.lastName || ""}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={client.email || ""}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
