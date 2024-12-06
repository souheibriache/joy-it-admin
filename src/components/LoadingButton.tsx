import { Loader, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
const LoadingButton = () => {
  return (
    <Button disabled>
      <Loader className="bg-overlay py-2  bg-purple rounded-lg text-white font-bold text-xl outline-none animate-pulse" />
      En cours
    </Button>
  );
};

export default LoadingButton;
