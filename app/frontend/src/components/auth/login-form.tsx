"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SigninWithGoogleImage from "@/assets/brand/signin-with-google.svg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { HomeIcon } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.SubmitEvent) => {
    e.preventDefault();
    authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center text-foreground/75">
            <CardTitle>Sign in</CardTitle>
            <Button
              variant="outline"
              size="icon-sm"
              className="border-none p-0"
              asChild
            >
              <Link href="/">
                <HomeIcon />
              </Link>
            </Button>
          </div>
          <CardDescription>
            Don&apos;t have an account?{" "}
            <Button variant={"link"} className="p-0" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                {/* <FieldLabel htmlFor="email">Email</FieldLabel> */}
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                {/* <FieldLabel htmlFor="password">Password</FieldLabel> */}
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
                <div className="flex items-center">
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </Field>
              <Field>
                <Button type="submit">Login</Button>{" "}
                <Button
                  variant="link"
                  type="button"
                  onClick={() =>
                    authClient.signIn.social({
                      provider: "google",
                    })
                  }
                  className="bg-[#f2f2f2]"
                >
                  <Image
                    className="h-[34px]"
                    width={189}
                    height={40}
                    src={SigninWithGoogleImage}
                    alt="Sign in with Google"
                  />
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
