import Link from "next/link";
import SiteHeader from "@/components/main/site-header";

export default function AboutPage() {
  return (
    <div className="container mx-auto flex flex-col flex-1 items-center justify-center">
      <SiteHeader />
      <main className="w-full flex-col gap-4">
        <section className="w-full p-4 bg-background">
          <h1 className="font-semibold tect-foreground/80 uppercase text-lg mb-2">
            About this project
          </h1>
          <p className="text-foreground/75">
            This is a template starter project using a new web development
            stack.
          </p>
          <ul className="space-y-2 my-2">
            <li>
              <span className="font-bold">
                <Link href="https://bun.com/" title="https://bun.com/">
                  Bun
                </Link>
              </span>
              {" - "}
              <span>The fast JavaScript runtime.</span>
            </li>
            <li>
              <span className="font-bold">
                <Link
                  href="https://www.npmjs.com/package/@bepalo/query"
                  title="https://www.npmjs.com/package/@bepalo/query"
                >
                  Bepalo-Query
                </Link>
              </span>
              {" - "}
              <span>
                A type-safe access-control-driven unified RESTful database query
                engine for backend using Drizzle ORM.
              </span>
            </li>
            <li>
              <span className="font-bold">
                <Link
                  href="https://orm.drizzle.team/"
                  title="https://orm.drizzle.team/"
                >
                  Drizzle
                </Link>
              </span>
              {" - "}
              <span>A typescript based ORM</span>
            </li>
            <li>
              <span className="font-bold">
                <Link href="https://nextjs.org/" title="https://nextjs.org/">
                  Nextjs
                </Link>
              </span>
              {" - "}
              <span>The React Framework for the Web</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
