"use client";

import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import Tooltipped from "../wrapper/tooltipped";

export default function DeleteAccountButton({ ...props }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) return null;

  return (
    <Tooltipped tooltip="Sign Out">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          const req = authClient.deleteUser({
            callbackURL: "/",
          });
          toast.promise(req, {
            loading: "deleting user account...",
            success: "deleted user account successfully",
            error: (error) => ({
              message: "Error deleting user account",
              description: error.message,
            }),
          });
        }}
        {...props}
      >
        <Trash2Icon />
      </Button>
    </Tooltipped>
  );
}
