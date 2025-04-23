import ActivitiesTable from "@/components/ActivitiesTable";
import PageTitle from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";

const Activities = () => {
  return (
    <div className="space-y-6">
      <PageTitle title="Activités" />

      <Card>
        <CardContent className="p-6">
          <ActivitiesTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Activities;
