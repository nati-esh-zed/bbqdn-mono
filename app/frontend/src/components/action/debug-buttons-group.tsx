import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { ButtonGroup } from "../ui/button-group";
import DeleteAccountButton from "./delete-account-button";
import HomeButton from "./home-button";
import LogoutButton from "./logout-button";
import ReloadButton from "./reload-button";

export default function DebugButtonsGroup({
  className,
  ...props
}: {
  className?: string;
}) {
  const buttonCn = "";
  return (
    <ButtonGroup
      aria-label="Debug controls"
      className={cn("w-fit", className)}
      {...props}
    >
      <HomeButton className={buttonCn} />
      <ReloadButton className={buttonCn} />
      <ThemeToggle className={buttonCn} />
      {/* <LogoutButton className={buttonCn} /> */}
      {/* <DeleteAccountButton className={buttonCn} /> */}
    </ButtonGroup>
  );
}
