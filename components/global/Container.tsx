import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**CONTAINER COMPONENT */
function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-6xl px-8 xl:max-w-7xl", className)}>
      {children}
    </div>
  );
}

export default Container;
