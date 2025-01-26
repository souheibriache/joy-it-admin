import React, { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";

import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import {
  useCreatePlan,
  useGetAllPlans,
  useUpdatePlan,
  useDeletePlan,
} from "@/utils/api/plans-api";
import { useGetPaginatedActivities } from "@/utils/api/activities-api";
import { IPlan } from "@/types/plans";

const Plans: React.FC = () => {
  const { plans: fetchedPlans } = useGetAllPlans();
  const { activities } = useGetPaginatedActivities({
    page: 1,
    take: 10,
    query: {},
  });

  const allActivities = Array.isArray(activities?.data) ? activities.data : [];

  const { mutate: createPlan } = useCreatePlan();
  const { mutate: updatePlan } = useUpdatePlan();
  const { mutate: deletePlan } = useDeletePlan();

  const [editingPlan, setEditingPlan] = useState<IPlan | null>(null);
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [newPlan, setNewPlan] = useState<IPlan | null>(null);
  const [activitySearchQuery, setActivitySearchQuery] = useState("");

  // Synchronize local state with fetched plans
  useEffect(() => {
    if (fetchedPlans) {
      setPlans(fetchedPlans);
    }
  }, [fetchedPlans]);

  const handleSave = () => {
    if (editingPlan) {
      const { id, createdAt, updatedAt, deletedAt, activities, ...rest } =
        editingPlan;

      const activityIds = activities.map((activity: any) => activity.id);

      // Optimistically update the plans array
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.id === id ? { ...editingPlan, activities } : plan
        )
      );

      // Update the backend
      updatePlan(
        { planId: id, data: { ...rest, activities: activityIds } },
        {
          onSuccess: () => {
            setEditingPlan(null); // Stop editing after successful save
          },
        }
      );
    } else if (newPlan) {
      const { id, activities, ...rest } = newPlan;
      const activityIds = activities.map((activity: any) => activity.id);

      // Create the new plan
      createPlan(
        { ...rest, activities: activityIds },
        {
          onSuccess: (createdPlan) => {
            setPlans((prevPlans) => [...prevPlans, createdPlan]);
            setNewPlan(null); // Clear the temporary plan
          },
        }
      );
    }
  };

  const handleDelete = (planId: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      // Optimistically remove the plan
      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));

      // Delete from backend
      deletePlan(planId);
    }
  };

  const handleCancelNewPlan = () => {
    setNewPlan(null); // Remove the new plan card
  };

  const handleAddBenefit = (plan: IPlan | null, newBenefit: string) => {
    if (plan && newBenefit.trim()) {
      if (plan === newPlan) {
        setNewPlan((prev) =>
          prev ? { ...prev, benifits: [...prev.benifits, newBenefit] } : prev
        );
      } else if (plan === editingPlan) {
        setEditingPlan((prev) =>
          prev ? { ...prev, benifits: [...prev.benifits, newBenefit] } : prev
        );
      }
    }
  };

  const handleRemoveBenefit = (plan: IPlan | null, benefitIndex: number) => {
    if (plan) {
      if (plan === newPlan) {
        setNewPlan((prev) =>
          prev
            ? {
                ...prev,
                benifits: prev.benifits.filter(
                  (_, idx) => idx !== benefitIndex
                ),
              }
            : prev
        );
      } else if (plan === editingPlan) {
        setEditingPlan((prev) =>
          prev
            ? {
                ...prev,
                benifits: prev.benifits.filter(
                  (_, idx) => idx !== benefitIndex
                ),
              }
            : prev
        );
      }
    }
  };

  const handleAddActivity = (plan: IPlan | null, activity: any) => {
    if (plan && !plan.activities.find((a: any) => a.id === activity.id)) {
      if (plan === newPlan) {
        setNewPlan((prev) =>
          prev ? { ...prev, activities: [...prev.activities, activity] } : prev
        );
      } else if (plan === editingPlan) {
        setEditingPlan((prev) =>
          prev ? { ...prev, activities: [...prev.activities, activity] } : prev
        );
      }
      setActivitySearchQuery("");
    }
  };

  const handleRemoveActivity = (plan: IPlan | null, activityId: string) => {
    if (plan) {
      if (plan === newPlan) {
        setNewPlan((prev) =>
          prev
            ? {
                ...prev,
                activities: prev.activities.filter(
                  (a: any) => a.id !== activityId
                ),
              }
            : prev
        );
      } else if (plan === editingPlan) {
        setEditingPlan((prev) =>
          prev
            ? {
                ...prev,
                activities: prev.activities.filter(
                  (a: any) => a.id !== activityId
                ),
              }
            : prev
        );
      }
    }
  };

  const filteredActivities = allActivities.filter((activity: any) =>
    activity.name.toLowerCase().includes(activitySearchQuery.toLowerCase())
  );

  return (
    <div>
      <PageTitle title="Plans" />
      <div className="flex gap-4 overflow-x-auto p-4">
        {/* Existing Plans */}
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="w-[400px] h-auto p-4 bg-white border rounded shadow flex flex-col gap-2"
          >
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={editingPlan?.id === plan.id ? editingPlan.name : plan.name}
              disabled={editingPlan?.id !== plan.id}
              onChange={(e) => {
                if (editingPlan?.id === plan.id) {
                  setEditingPlan((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  );
                }
              }}
              className="w-full border rounded px-3 py-2"
            />

            <label className="block text-sm font-medium">Credits</label>
            <input
              type="number"
              value={
                editingPlan?.id === plan.id ? editingPlan.credit : plan.credit
              }
              disabled={editingPlan?.id !== plan.id}
              onChange={(e) => {
                if (editingPlan?.id === plan.id) {
                  setEditingPlan((prev) =>
                    prev
                      ? { ...prev, credit: parseInt(e.target.value, 10) }
                      : prev
                  );
                }
              }}
              className="w-full border rounded px-3 py-2"
            />

            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              value={
                editingPlan?.id === plan.id ? editingPlan.price : plan.price
              }
              disabled={editingPlan?.id !== plan.id}
              onChange={(e) => {
                if (editingPlan?.id === plan.id) {
                  setEditingPlan((prev) =>
                    prev ? { ...prev, price: parseFloat(e.target.value) } : prev
                  );
                }
              }}
              className="w-full border rounded px-3 py-2"
            />

            <label className="block text-sm font-medium">Benefits</label>
            <ul className="mt-2">
              {(editingPlan?.id === plan.id
                ? editingPlan.benifits
                : plan.benifits
              ).map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={benefit}
                    disabled={editingPlan?.id !== plan.id}
                    onChange={(e) => {
                      if (editingPlan?.id === plan.id) {
                        setEditingPlan((prev) =>
                          prev
                            ? {
                                ...prev,
                                benifits: prev.benifits.map((b, i) =>
                                  i === idx ? e.target.value : b
                                ),
                              }
                            : prev
                        );
                      }
                    }}
                    className="w-full border rounded px-3 py-2"
                  />
                  {editingPlan?.id === plan.id && (
                    <Button
                      className="bg-red-500 text-white"
                      onClick={() => handleRemoveBenefit(editingPlan, idx)}
                    >
                      <Trash />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
            {editingPlan?.id === plan.id && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a benefit"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleAddBenefit(editingPlan, e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}

            <label className="block text-sm font-medium">Activities</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(editingPlan?.id === plan.id
                ? editingPlan.activities
                : plan.activities
              ).map((activity: any, idx) => (
                <div
                  key={idx}
                  className="relative px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 group"
                >
                  <span>{activity.name}</span>
                  {editingPlan?.id === plan.id && (
                    <Button
                      className="absolute -top-1 -right-1 p-1 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                      onClick={() =>
                        handleRemoveActivity(editingPlan, activity.id)
                      }
                    >
                      <Trash className="p-0.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {editingPlan?.id === plan.id && (
              <div className="flex flex-col gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Search activities"
                  value={activitySearchQuery}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                {activitySearchQuery && (
                  <ul className="max-h-24 overflow-y-auto border p-2">
                    {filteredActivities.map((activity: any) => (
                      <li
                        key={activity.id}
                        className="cursor-pointer"
                        onClick={() => handleAddActivity(editingPlan, activity)}
                      >
                        {activity.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <div className="flex gap-2 mt-auto">
              {editingPlan?.id === plan.id ? (
                <Button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </Button>
              ) : (
                <Button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => setEditingPlan(plan)}
                >
                  Edit
                </Button>
              )}
              <Button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDelete(plan.id)}
              >
                <Trash />
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Plan Trigger */}
        {plans.length < 4 && !newPlan && (
          <div
            className="w-[400px] h-auto p-4 bg-gray-100 border-dashed border-2 rounded flex items-center justify-center cursor-pointer"
            onClick={() =>
              setNewPlan({
                id: "",
                name: "",
                credit: 0,
                price: 0,
                benifits: [],
                activities: [],
              })
            }
          >
            <Plus className="text-4xl" />
          </div>
        )}

        {/* New Plan Card */}
        {newPlan && (
          <div className="w-[400px] h-auto p-4 bg-white border rounded shadow flex flex-col gap-2">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={newPlan.name}
              onChange={(e) =>
                setNewPlan((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
              className="w-full border rounded px-3 py-2"
            />

            <label className="block text-sm font-medium">Credits</label>
            <input
              type="number"
              value={newPlan.credit}
              onChange={(e) =>
                setNewPlan((prev) =>
                  prev
                    ? { ...prev, credit: parseInt(e.target.value, 10) }
                    : prev
                )
              }
              className="w-full border rounded px-3 py-2"
            />

            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              value={newPlan.price}
              onChange={(e) =>
                setNewPlan((prev) =>
                  prev ? { ...prev, price: parseFloat(e.target.value) } : prev
                )
              }
              className="w-full border rounded px-3 py-2"
            />

            <label className="block text-sm font-medium">Benefits</label>
            <ul className="mt-2">
              {newPlan.benifits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) =>
                      setNewPlan((prev) =>
                        prev
                          ? {
                              ...prev,
                              benifits: prev.benifits.map((b, i) =>
                                i === idx ? e.target.value : b
                              ),
                            }
                          : prev
                      )
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                  <Button
                    className="bg-red-500 text-white"
                    onClick={() => handleRemoveBenefit(newPlan, idx)}
                  >
                    <Trash />
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a benefit"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleAddBenefit(newPlan, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <label className="block text-sm font-medium">Activities</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {newPlan.activities.map((activity: any, idx) => (
                <div
                  key={idx}
                  className="relative px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 group"
                >
                  <span>{activity.name}</span>
                  {
                    <Button
                      className="absolute -top-1 -right-1 p-1 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                      onClick={() => handleRemoveActivity(newPlan, activity.id)}
                    >
                      <Trash className="p-0.5" />
                    </Button>
                  }
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <input
                type="text"
                placeholder="Search activities"
                value={activitySearchQuery}
                onChange={(e) => setActivitySearchQuery(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {activitySearchQuery && (
                <ul className="max-h-24 overflow-y-auto border p-2">
                  {filteredActivities.map((activity: any) => (
                    <li
                      key={activity.id}
                      className="cursor-pointer"
                      onClick={() => handleAddActivity(newPlan, activity)}
                    >
                      {activity.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleCancelNewPlan}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;
