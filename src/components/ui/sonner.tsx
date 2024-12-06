import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:border group-[.toaster]:shadow-lg",
          success: "bg-green-500 text-white",
          error: "bg-red-500 text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
