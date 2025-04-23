import { ChevronRight } from "lucide-react";

type Props = {
  title: string;
  breadCump?: string[];
};

const PageTitle = ({ title, breadCump }: Props) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {title}
      </h1>

      {breadCump && breadCump.length > 0 && (
        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="hover:text-purple dark:hover:text-purple-300 cursor-pointer">
            {title}
          </span>
          {breadCump.map((element, index) => (
            <div key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              <span
                className={
                  index === breadCump.length - 1
                    ? "font-medium text-purple dark:text-purple-300"
                    : ""
                }
              >
                {element}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageTitle;
