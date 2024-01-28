import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const db = new PrismaClient();
  const formData = await request.formData();
  const { date, type, text } = Object.fromEntries(formData);

  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string"
  ) {
    throw new Error("Bad request");
  }

  await db.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });
  return redirect("/");
}

export async function loader() {
  const db = new PrismaClient();
  const entries = await db.entry.findMany();
  return entries;
}

export default function Index() {
  const entries = useLoaderData<typeof loader>();

  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && textAreaRef.current) {
      textAreaRef.current.value = "";
      textAreaRef.current.focus();
    }
  }, [fetcher.state]);

  return (
    <div className="p-10">
      <h1 className="text-5xl">Hello, Build UI!</h1>
      <p className="mt-2 text-lg text-gray-400">Learnings and doings</p>

      <div className="mt-4">
        <p className="font-bold">
          Week of January 22<sup>nd</sup>
        </p>
      </div>

      <div className="my-8 border p-3">
        <fetcher.Form method="post">
          <p className="italic">Create an entry</p>
          <fieldset
            className="disabled:opacity-70"
            disabled={fetcher.state === "submitting"}
          >
            <div className="mt-4">
              <input
                type="date"
                name="date"
                required
                className="text-gray-900"
                defaultValue={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            <div className="mt-5 space-x-6">
              <label>
                <input
                  className="mr-1"
                  type="radio"
                  name="type"
                  value="work"
                  defaultChecked
                />
                Work
              </label>
              <label>
                <input
                  className="mr-1"
                  type="radio"
                  name="type"
                  required
                  value="learning"
                />
                Learning
              </label>
              <label>
                <input
                  className="mr-1"
                  type="radio"
                  name="type"
                  required
                  value="interesting-thing"
                />
                Interesting thing
              </label>
            </div>
            <div className="mt-2">
              <textarea
                name="text"
                className="w-full text-gray-700"
                placeholder="Write your entry..."
                ref={textAreaRef}
              ></textarea>
            </div>

            <div className="mt-1 text-right">
              <button
                type="submit"
                className="bg-blue-500 px-4 py-1 font-medium text-white"
              >
                {fetcher.state === "submitting" ? "Saving..." : "Save"}
              </button>
            </div>
          </fieldset>
        </fetcher.Form>
      </div>

      <div className="mt-3 space-y-4">
        {entries.map((entry) => (
          <p key={entry.id}>{entry.text}</p>
        ))}
      </div>
    </div>
  );
}
