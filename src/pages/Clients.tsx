import { CompaniesTable } from "@/components/CompaniesTable";
import PageTitle from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";

const Clients = () => {
  return (
    <div className="space-y-6">
      <PageTitle title="Clients" />

      <Card>
        <CardContent className="p-6">
          <CompaniesTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
