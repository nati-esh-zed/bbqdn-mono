import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function Tooltipped({
  tooltip,
  children,
  asChild,
  ...props
}: {
  tooltip: ReactNode;
  children: ReactNode;
  asChild?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild {...props}>
        {children}
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
