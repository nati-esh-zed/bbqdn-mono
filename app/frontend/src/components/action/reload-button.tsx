"use client";

import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Tooltipped from "../wrapper/tooltipped";

export default function ReloadButton({
  className,
  asChild,
  ...props
}: {
  className?: string;
  asChild?: boolean;
}) {
  const router = useRouter();
  return (
    <Tooltipped tooltip="Sign Out">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          router.refresh();
        }}
        className={cn(className)}
        {...props}
      >
        <RefreshCwIcon />
      </Button>
    </Tooltipped>
  );
}
