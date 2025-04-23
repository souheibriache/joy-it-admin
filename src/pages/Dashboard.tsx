import type React from "react";
import PageTitle from "@/components/PageTitle";
import { useGetAnalytics } from "@/utils/api/analytics-api";
import {
  Building2,
  Calendar,
  Activity,
  CreditCard,
  ClipboardList,
  Loader2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const { analytics, isLoading } = useGetAnalytics();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 p-6">
        <PageTitle title="Tableau de bord" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 text-purple animate-spin" />
        </div>
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
    <div className="flex flex-col gap-8 p-6">
      <PageTitle title="Tableau de bord" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Entreprises"
          value={totalCompanies}
          icon={<Building2 className="w-6 h-6" />}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <SummaryCard
          title="Abonnements"
          value={totalSubscriptions}
          icon={<ClipboardList className="w-6 h-6" />}
          color="bg-gradient-to-br from-purple to-secondarypurple"
        />
        <SummaryCard
          title="Activités"
          value={totalActivities}
          icon={<Activity className="w-6 h-6" />}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
        />
        <SummaryCard
          title="Crédits Consommés"
          value={totalCreditsConsumed}
          icon={<CreditCard className="w-6 h-6" />}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Companies Card */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Détails des Entreprises
            </h3>
            <Building2 className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            <StatItem
              icon={<CheckCircle className="w-4 h-4 text-green-500" />}
              label="Vérifiées"
              value={verifiedCompanies}
              percentage={Math.round(
                (verifiedCompanies / totalCompanies) * 100
              )}
              color="bg-green-100"
            />
            <StatItem
              icon={<XCircle className="w-4 h-4 text-red-500" />}
              label="Non vérifiées"
              value={unverifiedCompanies}
              percentage={Math.round(
                (unverifiedCompanies / totalCompanies) * 100
              )}
              color="bg-red-100"
            />
          </div>
        </div>

        {/* Subscriptions Card */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Formules</h3>
            <Users className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Total des Formules:{" "}
              <span className="font-semibold">{totalPlans}</span>
            </p>
            <h4 className="text-sm font-medium text-gray-700">
              Abonnements par Formule:
            </h4>
            {subscriptionsPerPlan &&
            Object.keys(subscriptionsPerPlan).length > 0 ? (
              <div className="space-y-2 mt-2">
                {Object.entries(
                  subscriptionsPerPlan as Record<string, number>
                ).map(([plan, count]) => (
                  <div
                    key={plan}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm font-medium">{plan}</span>
                    <span className="text-sm bg-purple text-white px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Aucun abonnement disponible.
              </p>
            )}
          </div>
        </div>

        {/* Schedules Card */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Plannings</h3>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Total des Plannings:{" "}
              <span className="font-semibold">{totalSchedules}</span>
            </p>
            <div className="space-y-3">
              <StatItem
                icon={<CheckCircle className="w-4 h-4 text-green-500" />}
                label="Terminés"
                value={completedSchedules}
                percentage={Math.round(
                  (completedSchedules / totalSchedules) * 100
                )}
                color="bg-green-100"
              />
              <StatItem
                icon={<Clock className="w-4 h-4 text-amber-500" />}
                label="En attente"
                value={pendingSchedules}
                percentage={Math.round(
                  (pendingSchedules / totalSchedules) * 100
                )}
                color="bg-amber-100"
              />
              <StatItem
                icon={<XCircle className="w-4 h-4 text-red-500" />}
                label="Annulés"
                value={canceledSchedules}
                percentage={Math.round(
                  (canceledSchedules / totalSchedules) * 100
                )}
                color="bg-red-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div
    className={`${color} text-white rounded-lg shadow-md p-6 flex items-center justify-between`}
  >
    <div>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
    <div className="bg-white/20 p-3 rounded-full">{icon}</div>
  </div>
);

// Stat Item Component
const StatItem = ({
  icon,
  label,
  value,
  percentage,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  percentage: number;
  color: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <div className={`${color} p-2 rounded-full`}>{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
        {percentage}%
      </span>
    </div>
  </div>
);

export default Dashboard;
