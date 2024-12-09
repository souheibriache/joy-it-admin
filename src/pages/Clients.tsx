import { CompaniesTable } from "@/components/CompaniesTable";
import PageTitle from "@/components/PageTitle";

type Props = {};

const Clients = ({}: Props) => {
  return (
    <div className="flex flex-col gap-10">
      <PageTitle title="Clients" />
      <CompaniesTable />
    </div>
  );
};

export default Clients;
