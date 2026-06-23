"use client";

import Image from "next/image";
import Link from "next/link";
import { type ComponentProps, type SubmitEvent, useId, useState } from "react";
import SignupWithGoogleImage from "@/assets/brand/signup-with-google.svg";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { HomeIcon } from "lucide-react";

export function SignupForm({ className, ...props }: ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();

  const handleSignup = (e: SubmitEvent) => {
    e.preventDefault();
    authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/login",
    });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center text-foreground/75">
            <CardTitle>Create an account</CardTitle>
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
            Already have an account?{" "}
            <Button variant={"link"} className="p-0" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <FieldGroup>
              <Field>
                {/* <FieldLabel htmlFor="name">Name</FieldLabel> */}
                <Input
                  id={nameId}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </Field>
              <Field>
                {/* <FieldLabel htmlFor="email">Email</FieldLabel> */}
                <Input
                  id={emailId}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                {/* <FieldLabel htmlFor="password">Password</FieldLabel> */}
                <Input
                  id={passwordId}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="********"
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Create Account</Button>
              </Field>
              <FieldSeparator>Or</FieldSeparator>
              <Field className="grid gap-4 sm:grid-cols-1">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() =>
                    authClient.signIn.social({
                      provider: "google",
                      callbackURL: "/",
                    })
                  }
                  className="bg-[#f2f2f2] hover:bg-[#f2f2f2] overflow-clip"
                >
                  <Image
                    className="h-[34px]"
                    width={189}
                    height={40}
                    src={SignupWithGoogleImage}
                    alt="Sign up with Google"
                  />
                </Button>
              </Field>
            </FieldGroup>
            <FieldDescription className="px-6 pt-2 text-center">
              By clicking continue, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </FieldDescription>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
