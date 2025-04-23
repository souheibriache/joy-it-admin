import PageTitle from "@/components/PageTitle";
import { useGetAnalytics } from "@/utils/api/analytics-api";
import {
  ClipboardList,
  Calendar,
  Activity,
  CreditCard,
  Building2,
  Loader2,
} from "lucide-react";

const Dashboard = () => {
  const { analytics, isLoading } = useGetAnalytics();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 p-6">
        <PageTitle title="Tableau de bord" />
        <Loader2 className="text-purple animate-spin" />
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
    <div className="flex flex-col gap-5 p-6">
      <PageTitle title="Tableau de bord" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Entreprises */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Entreprises</h3>
          </div>
          <p className="mt-2">Total : {totalCompanies}</p>
          <p>Vérifiées : {verifiedCompanies}</p>
          <p>Non vérifiées : {unverifiedCompanies}</p>
        </div>

        {/* Formules */}
        <div className="bg-gradient-to-r from-secondarypurple to-purple text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Formules</h3>
          </div>
          <p className="mt-2">Total des Formules : {totalPlans}</p>
          <h4 className="text-sm mt-2 font-semibold">
            Abonnements par Formule :
          </h4>
          {subscriptionsPerPlan &&
          Object.keys(subscriptionsPerPlan).length > 0 ? (
            <ul className="list-disc ml-4">
              {Object.entries(
                subscriptionsPerPlan as Record<string, number>
              ).map(([plan, count]) => (
                <li key={plan}>
                  {plan} : {count}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun abonnement disponible.</p>
          )}
        </div>

        {/* Abonnements */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Abonnements</h3>
          </div>
          <p className="mt-2">Total des Abonnements : {totalSubscriptions}</p>
        </div>

        {/* Plannings */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Plannings</h3>
          </div>
          <p className="mt-2">Total des Plannings : {totalSchedules}</p>
          <p>Terminés : {completedSchedules}</p>
          <p>En attente : {pendingSchedules}</p>
          <p>Annulés : {canceledSchedules}</p>
        </div>

        {/* Activités */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <Activity className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Activités</h3>
          </div>
          <p className="mt-2">Total des Activités : {totalActivities}</p>
        </div>

        {/* Crédits */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg p-4 rounded-md">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold">Crédits</h3>
          </div>
          <p className="mt-2">
            Total des Crédits consommés : {totalCreditsConsumed}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
