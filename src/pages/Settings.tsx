import React, { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";

import { useGetPricing, useUpdatePricing } from "@/utils/api/pricing-api";
import { IPricing } from "@/types/pricing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader } from "lucide-react";
import {
  IFaq,
  useCreateFaq,
  useDeleteFaq,
  useGetFaqs,
  useUpdateFaq,
} from "@/utils/api/faq-api";
declare type Sections = "pricing" | "faq" | "none";
const Settings: React.FC = () => {
  // Fetch the single pricing object
  const { pricing: fetchedPricing, isLoading } = useGetPricing();
  const { mutate: updatePricing } = useUpdatePricing();

  const { data: faqs } = useGetFaqs();
  const createFaqMutation = useCreateFaq();
  const updateFaqMutation = useUpdateFaq();
  const deleteFaqMutation = useDeleteFaq();

  const [editingFaq, setEditingFaq] = useState<IFaq | null>(null);

  const [newFaq, setNewFaq] = useState<{ question: string; answer: string }>({
    question: "",
    answer: "",
  });

  const handleCreateFaq = () => {
    if (!newFaq.question || !newFaq.answer) {
      toast.error("Veuillez renseigner la question et la réponse.");
      return;
    }
    createFaqMutation.mutate({ data: newFaq });
    setNewFaq({ question: "", answer: "" });
  };

  const handleUpdateFaq = (
    id: string,
    updatedData: { question: string; answer: string }
  ) => {
    if (!updatedData.question || !updatedData.answer) {
      toast.error("Veuillez renseigner la question et la réponse.");
      return;
    }
    updateFaqMutation.mutate({ id, data: updatedData });
    setEditingFaq(null);
  };

  const handleDeleteFaq = (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette FAQ ?")) {
      deleteFaqMutation.mutate(id);
    }
  };

  // Local state for pricing and editing mode
  const [pricing, setPricing] = useState<IPricing | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [openedSection, setOpenedSection] = useState<Sections>("pricing");
  const handleToggleOpenedSection = (currentSection: Sections) => {
    if (openedSection === currentSection) {
      setOpenedSection("none");
    } else {
      setOpenedSection(currentSection);
    }
  };

  // Synchronize local state with fetched pricing
  useEffect(() => {
    if (fetchedPricing) {
      setPricing(fetchedPricing);
    }
  }, [fetchedPricing]);

  // Handle input changes
  const handleChange = (field: keyof IPricing, value: number) => {
    if (pricing) {
      setPricing({ ...pricing, [field]: value });
    }
  };

  // Handle update submission
  const handlePricingSave = () => {
    if (pricing) {
      updatePricing({ data: pricing });
      setEditing(false);
    }
  };

  // Render loading state

  return (
    <div className="p-6 space-y-8">
      <PageTitle title="Paramètres" />

      {/* Pricing Section */}
      <section
        className={`bg-white p-6 rounded shadow overflow-hidden flex flex-col transition-all duration-200 ${
          openedSection === "pricing" ? "max-h-[500px]" : "max-h-[80px]"
        }`}
      >
        {!isLoading && pricing ? (
          <>
            <div
              className={`flex flex-row w-full justify-between ${
                openedSection === "pricing" ? "h-full items-center" : ""
              }`}
            >
              <h2 className="text-xl font-semibold text-gray-700 h-[50px] mb-4">
                Tarification
              </h2>

              <Button
                variant="ghost"
                onClick={() => handleToggleOpenedSection("pricing")}
              >
                {openedSection === "pricing" ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-blue-800 text-sm">
                Ces tarifs représentent les prix de base utilisés pour calculer
                le montant total de l'abonnement. Ils incluent le coût par
                employé (participant), ainsi que les tarifs de base pour les
                services de snacking, de teambuilding et de bien-être.
              </p>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="w-40 font-medium text-gray-600">
                    Employés:
                  </label>
                  <input
                    type="number"
                    value={pricing.employee}
                    onChange={(e) =>
                      handleChange("employee", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-40 font-medium text-gray-600">
                    Snacking:
                  </label>
                  <input
                    type="number"
                    value={pricing.snacking}
                    onChange={(e) =>
                      handleChange("snacking", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-40 font-medium text-gray-600">
                    Teambuilding:
                  </label>
                  <input
                    type="number"
                    value={pricing.teambuilding}
                    onChange={(e) =>
                      handleChange("teambuilding", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-40 font-medium text-gray-600">
                    Bien-être:
                  </label>
                  <input
                    type="number"
                    value={pricing.wellBeing}
                    onChange={(e) =>
                      handleChange("wellBeing", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handlePricingSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  <span className="font-medium text-gray-600">Employés:</span>{" "}
                  {pricing.employee}
                </p>

                <p>
                  <span className="font-medium text-gray-600">Snacking:</span>{" "}
                  {pricing.snacking}
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Teambuilding:
                  </span>{" "}
                  {pricing.teambuilding}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Bien-être:</span>{" "}
                  {pricing.wellBeing}
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <Loader className="animate-spin" />
          </div>
        )}
      </section>

      {/* FAQ Section Placeholder */}
      <section
        className={`bg-white p-6 rounded shadow overflow-hidden flex flex-col transition-all duration-200  ${
          openedSection === "faq"
            ? "max-h-[630px] overflow-y-auto"
            : "max-h-[80px] overflow-y-hidden"
        }`}
      >
        <div
          className={`flex flex-row w-full justify-between ${
            openedSection === "faq" ? "h-full items-center" : ""
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-700 h-[50px] mb-4">
            Liste des questions FAQ
          </h2>

          <Button
            variant="ghost"
            onClick={() => handleToggleOpenedSection("faq")}
          >
            {openedSection === "faq" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>

        {/* List of FAQs */}
        {faqs && faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className=" p-4 rounded shadow bg-purple bg-opacity-10"
              >
                {editingFaq && editingFaq.id === faq.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingFaq.question}
                      onChange={(e) =>
                        setEditingFaq({
                          ...editingFaq,
                          question: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                      placeholder="Question"
                    />
                    <textarea
                      value={editingFaq.answer}
                      onChange={(e) =>
                        setEditingFaq({ ...editingFaq, answer: e.target.value })
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                      placeholder="Réponse"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingFaq(null)}
                        className="px-3 py-1 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() =>
                          editingFaq &&
                          handleUpdateFaq(editingFaq.id, {
                            question: editingFaq.question,
                            answer: editingFaq.answer,
                          })
                        }
                        className="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-gray-800">{faq.question}</p>
                    <p className="text-gray-600">{faq.answer}</p>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => setEditingFaq(faq)}
                        className="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="px-3 py-1 bg-red-600 rounded text-white hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Aucune FAQ pour le moment.</p>
        )}

        {/* Section to create a new FAQ */}
        <div className="mt-8 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Ajouter une FAQ
          </h3>
          <input
            type="text"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full mb-2"
            placeholder="Nouvelle question"
          />
          <textarea
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full mb-2"
            placeholder="Votre réponse"
          />
          <div className="flex justify-end">
            <button
              onClick={handleCreateFaq}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Ajouter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
