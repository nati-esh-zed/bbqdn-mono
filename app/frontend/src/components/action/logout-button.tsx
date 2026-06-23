"use client";

import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import Tooltipped from "../wrapper/tooltipped";
import { cn } from "@/lib/utils";

export default function LogoutButton({
  className,
  ...props
}: {
  className?: string;
}) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) return null;

  return (
    <Tooltipped tooltip="Sign Out">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          const req = authClient.signOut();
          toast.promise(req, {
            loading: "signing out...",
            success: "signed out successfully",
            error: (error) => ({
              message: "Error signing out",
              description: error.message,
            }),
          });
        }}
        className={cn(className)}
        {...props}
      >
        <LogOutIcon />
      </Button>
    </Tooltipped>
  );
}
