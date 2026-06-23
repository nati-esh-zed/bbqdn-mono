"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import queryClient, {
  Database,
  type InferResponseTypeMany,
  type Schema,
} from "@/lib/query-client";
import { cn } from "@/lib/utils";
import SiteHeader from "@/components/main/site-header";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Qahiri } from "next/font/google";

// const b: InferResponseTypeMany<"baskets", Schema, "basket", ["fruit"]>;
// b.baskets[0].fruit[0].

export default function Home() {
  const { data: session, isPending, error } = authClient.useSession();
  //
  const [fruitsRes, setfruitsRes] = useState<InferResponseTypeMany<
    "fruits",
    Schema,
    "fruit"
  > | null>(null);
  const [loadingFruits, setLoadingFruits] = useState<boolean>(false);
  //
  const [basketsRes, setbasketsRes] = useState<InferResponseTypeMany<
    "baskets",
    Schema,
    "basket"
  > | null>(null);
  const [loadingBaskets, setLoadingBaskets] = useState<boolean>(false);
  const [_ready, _setReady] = useState(false);

  useEffect(() => {
    _setReady(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error("Error Loading Session", {
        description: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (_ready && fruitsRes == null && !loadingFruits) {
      setLoadingFruits(true);

      const req = queryClient
        .GetMany<"fruit", "fruits">("/query/fruits", {
          "mine|guest": true,
          select: {
            columns: {
              id: true,
              name: true,
              sweetness: true,
              sourness: true,
              bitterness: true,
            },
          },
        })
        .then(async (res) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setfruitsRes(res);
          setLoadingFruits(false);
          return res;
        })
        .catch((error) => {
          setLoadingFruits(false);
          throw error;
        });
      toast.promise(req, {
        loading: "fetching fruits...",
        success: (data) => `${data?.count} fruits have been fetched`,
        error: (error) => ({
          message: "Error fetching frutis",
          description: error.message,
        }),
      });
    }
  }, [_ready, fruitsRes, loadingFruits]);

  useEffect(() => {
    if (_ready && basketsRes == null && !loadingBaskets) {
      setLoadingBaskets(true);

      const req = queryClient
        .GetMany<"basket", "baskets">("/query/baskets", {
          "mine|guest": true,
          select: {
            columns: {
              id: true,
              name: true,
              capacity: true,
            },
            with: {
              fruit: {
                columns: { id: true },
              },
            },
          },
        })
        .then(async (res) => {
          await new Promise((res) => setTimeout(res, 2000));
          setbasketsRes(res);
          setLoadingBaskets(false);
          return res;
        })
        .catch((error) => {
          setLoadingBaskets(false);
          throw error;
        });
      toast.promise(req, {
        loading: "fetching baskets...",
        success: (data) => `${data?.count} baskets have been fetched`,
        error: (error) => ({
          message: "Error fetching frutis",
          description: error.message,
        }),
      });
    }
  }, [_ready, basketsRes, loadingBaskets]);

  if (!_ready) return null;
  // if (isPending) return <p>Loading...</p>;
  return (
    <div className="container mx-auto flex flex-col flex-1 items-center justify-center">
      <SiteHeader />
      <main className="flex flex-1 w-full flex-col items-center justify-between sm:items-start">
        <div className="w-full flex flex-col gap-3">
          {/* fruits */}
          <section className="bg-accent w-full">
            <CollapsibleCard
              className="p-4 w-full mt-2 bg-background/40"
              defaultState={true}
              title={
                <div className="flex gap-2 items-center px-2 py-2">
                  <h2 className="text-lg font-bold">Fruits</h2>
                  {loadingFruits && <Spinner />}
                </div>
              }
            >
              {!loadingFruits && fruitsRes && (
                <div className="px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                  {fruitsRes.fruits?.map(
                    ({ id, name, sweetness, sourness, bitterness }) => (
                      <Card
                        key={id}
                        className="gap-3 bg-secondary/90 px-2 py-5"
                      >
                        <CardTitle className="px-4 pb-2 border-b">
                          <h2>{name}</h2>
                        </CardTitle>
                        <CardContent className="px-4 min-h-20 min-w-20 text-foreground/85">
                          <FieldGroup>
                            <FieldSet>
                              {/* <FieldLegend></FieldLegend> */}
                              {/* <FieldDescription></FieldDescription> */}
                              <FieldGroup className="gap-2">
                                {Object.entries({
                                  sweetness: sweetness.toFixed(1),
                                  sourness: sourness.toFixed(1),
                                  bitterness: bitterness.toFixed(1),
                                }).map(([name, value], idx) => (
                                  <Field
                                    key={"" + id + idx}
                                    orientation="horizontal"
                                    className=""
                                  >
                                    <FieldLabel className="capitalize">
                                      {name}
                                    </FieldLabel>
                                    {value}
                                  </Field>
                                ))}
                              </FieldGroup>
                            </FieldSet>
                          </FieldGroup>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              )}
            </CollapsibleCard>
          </section>

          {/* baskets */}
          <section className="bg-accent w-full">
            <CollapsibleCard
              className="p-4 w-full mt-2 bg-background/40"
              defaultState={true}
              title={
                <div className="flex gap-2 items-center px-2 py-2">
                  <h2 className="text-lg font-bold">Baskets</h2>
                  {loadingBaskets && <Spinner />}
                </div>
              }
            >
              {!loadingBaskets && basketsRes && (
                <div className="px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                  {(
                    basketsRes.baskets as
                      | {
                          id: string;
                          name: string;
                          createdAt: Date;
                          updatedAt: Date;
                          capacity: number;
                          fruit: any[];
                        }[]
                      | null
                  )?.map(({ id, name, capacity, fruit }) => (
                    <Card key={id} className="gap-3 bg-secondary/90 px-2 py-5">
                      <CardTitle className="px-4 pb-2 border-b">
                        <h2>{name}</h2>
                      </CardTitle>
                      <CardContent className="px-4 min-h-20 min-w-20 text-foreground/85">
                        <FieldGroup>
                          <FieldSet>
                            {/* <FieldLegend></FieldLegend> */}
                            {/* <FieldDescription></FieldDescription> */}
                            <FieldGroup className="gap-2">
                              {Object.entries({
                                capacity: capacity.toFixed(),
                                fruits: fruit?.length ?? 0,
                              }).map(([name, value], idx) => (
                                <Field
                                  key={"" + id + idx}
                                  orientation="horizontal"
                                  className=""
                                >
                                  <FieldLabel className="capitalize">
                                    {name}
                                  </FieldLabel>
                                  {value}
                                </Field>
                              ))}
                            </FieldGroup>
                          </FieldSet>
                        </FieldGroup>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CollapsibleCard>
          </section>

          <UserPosts />
        </div>
      </main>
    </div>
  );
}

export function UserPosts() {
  const { data: session, isPending, error } = authClient.useSession();
  const [postsRes, setpostsRes] =
    useState<InferResponseTypeMany<"posts", Schema, "post">>();
  const [loadingPosts, setLoadingPosts] = useState<boolean>(
    session !== null && postsRes == null,
  );

  useEffect(() => {
    if (error) {
      toast("Error Loading Session", {
        description: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (session != null) {
      setLoadingPosts(true);

      const req = queryClient
        .GetMany<"post", "posts">("/query/posts", {
          "mine|guest": true,
          select: {
            columns: {
              id: true,
              title: true,
              body: true,
            },
            // with: {
            //   user: {
            //     columns: {
            //       name: true,
            //     },
            //   },
            // },
          },
        })
        .then((res) => {
          setpostsRes(res);
          setLoadingPosts(false);
          return res;
        })
        .catch((error) => {
          setLoadingPosts(false);
          throw error;
        });
      toast.promise(req, {
        loading: "fetching posts...",
        success: (data) => `${data?.count} posts have been fetched`,
        error: (error) => ({
          message: "Error fetching posts",
          description: error.message,
        }),
      });
    }
  }, [session]);

  return (
    <>
      <section className="bg-accent w-full">
        {session && (
          <CollapsibleCard
            className="p-4 w-full mt-2 bg-background/40"
            defaultState={true}
            title={
              <div className="flex gap-2 items-center px-2 py-2">
                <h2 className="text-lg font-bold">Posts</h2>
                {loadingPosts && <Spinner />}
              </div>
            }
          >
            {!loadingPosts && postsRes && (
              <div className="px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                {postsRes.posts?.map(({ id, title, body }) => (
                  <Card key={id} className="gap-3 bg-secondary/90 px-2 py-5">
                    <CardTitle className="px-4 pb-2 border-b">
                      <h2>{title}</h2>
                    </CardTitle>
                    <CardContent className="px-4 min-h-20 min-w-20 text-foreground/85">
                      {body}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CollapsibleCard>
        )}
      </section>
      <section className="bg-accent w-full">
        {session && (
          <CollapsibleCard
            className="p-4 w-full mt-2 bg-background/40"
            title={
              <div className="flex gap-2 items-center px-2 py-2">
                <h2 className="text-lg font-bold">Session</h2>
                {isPending && <Spinner />}
              </div>
            }
          >
            {!isPending && session && (
              <div className="w-full">
                <div className="w-full p-8 bg-secondary/90 px-2 py-5 overflow-hidden">
                  <pre className="w-full overflow-scroll">
                    {session && JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CollapsibleCard>
        )}
      </section>
    </>
  );
}

function CollapsibleCard({
  title,
  defaultState = false,
  children,
  className,
  ...props
}: {
  title: ReactNode;
  className?: string;
  defaultState?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultState);

  return (
    <Collapsible
      className={cn(className)}
      open={open}
      onOpenChange={setOpen}
      {...props}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex gap-2 mb-2 items-center pl-2 hover:bg-transparent dark:hover:bg-transparent
aria-expanded:bg-transparent capitalize text-foreground/60 aria-expanded:text-foreground/60 font-normal"
          // className="flex gap-2 mb-2 items-center text-primary hover:bg-transparent dark:hover:bg-transparent hover:text-primary aria-expanded:bg-transparent aria-expanded:text-primary"
        >
          {open ? <ChevronDown /> : <ChevronRight />}
          <span>{title}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mb-4">{children}</CollapsibleContent>
    </Collapsible>
  );
}
