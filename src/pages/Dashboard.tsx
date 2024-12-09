import { useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import { useGetAnalytics } from "@/utils/api/analytics-api";
import {
  ClipboardList,
  Calendar,
  Activity,
  CreditCard,
  Building2,
} from "lucide-react";

const Dashboard = () => {
  const { analytics, isLoading } = useGetAnalytics();

  useEffect(() => {
    console.log({ analytics });
  }, [analytics]);

  if (isLoading) {
    return (
      <div>
        <PageTitle title="Tableau de bord" />
        <p>Loading analytics...</p>
      </div>
    );
  }

  const {
    totalCompanies,
    verifiedCompanies,
    unverifiedCompanies,
    totalPlans,
    subscriptionsPerPlan,
    totalSubscriptions,
    totalSchedules,
    completedSchedules,
    pendingSchedules,
    canceledSchedules,
    totalActivities,
    totalCreditsConsumed,
  } = analytics!;

  return (
    <div className="p-6">
      <PageTitle title="Tableau de bord" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Companies */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Companies</h3>
          </div>
          <p className="mt-2">Total: {totalCompanies}</p>
          <p>Verified: {verifiedCompanies}</p>
          <p>Unverified: {unverifiedCompanies}</p>
        </div>

        {/* Plans */}
        <div className="bg-gradient-to-r from-secondarypurple to-purple text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Plans</h3>
          </div>
          <p className="mt-2">Total Plans: {totalPlans}</p>
          <h4 className="text-sm mt-2 font-semibold">
            Subscriptions Per Plan:
          </h4>
          {subscriptionsPerPlan &&
          Object.keys(subscriptionsPerPlan).length > 0 ? (
            <ul className="list-disc ml-4">
              {Object.entries(
                subscriptionsPerPlan as Record<string, number>
              ).map(([plan, count]) => (
                <li key={plan}>
                  {plan}: {count}
                </li>
              ))}
            </ul>
          ) : (
            <p>No subscriptions available.</p>
          )}
        </div>

        {/* Subscriptions */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Subscriptions</h3>
          </div>
          <p className="mt-2">Total Subscriptions: {totalSubscriptions}</p>
        </div>

        {/* Schedules */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Schedules</h3>
          </div>
          <p className="mt-2">Total Schedules: {totalSchedules}</p>
          <p>Completed: {completedSchedules}</p>
          <p>Pending: {pendingSchedules}</p>
          <p>Canceled: {canceledSchedules}</p>
        </div>

        {/* Activities */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <Activity className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Activities</h3>
          </div>
          <p className="mt-2">Total Activities: {totalActivities}</p>
        </div>

        {/* Credits */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Credits</h3>
          </div>
          <p className="mt-2">Total Credits Consumed: {totalCreditsConsumed}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
