import ActivitiesTable from "@/components/ActivitiesTable";
import PageTitle from "@/components/PageTitle";

type Props = {};

const Activities = ({}: Props) => {
  return (
    <div className="flex flex-col gap-10">
      <PageTitle title="Activities" />
      <ActivitiesTable />
    </div>
  );
};

export default Activities;
