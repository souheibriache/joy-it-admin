type Props = {
  title: string;
  breadCump?: string[];
};

const PageTitle = ({ title, breadCump }: Props) => {
  return (
    <div className="flex flex-row gap-1 text-gray-800 items-baseline">
      <p className="text-xl font-bold ">{title}</p>
      {breadCump && (
        <p className="flex flex-row gap-1 items-baseline">
          /
          {breadCump.map((element, index) => (
            <>
              <p>{element}</p> {index < breadCump.length - 1 && "/"}
            </>
          ))}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
