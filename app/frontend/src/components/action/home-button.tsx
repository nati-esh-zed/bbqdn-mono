"use client";

import { HomeIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Tooltipped from "../wrapper/tooltipped";

export default function HomeButton({ ...props }) {
  return (
    <Tooltipped tooltip="Sign Out">
      <Button variant="outline" size="icon" {...props} asChild>
        <Link href="/">
          <HomeIcon />
        </Link>
      </Button>
    </Tooltipped>
  );
}
