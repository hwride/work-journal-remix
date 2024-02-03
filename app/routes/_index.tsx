import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { format, parseISO, startOfWeek } from "date-fns";
import { EntryForm } from "~/components/entry-form";

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
  return entries.map((entry) => ({
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  }));
}

export default function Index() {
  const entries = useLoaderData<typeof loader>();

  const entriesByWeek = entries.reduce<Record<string, typeof entries>>(
    (memo, entry) => {
      const startOfWeekVal = startOfWeek(parseISO(entry.date));
      const startOfWeekStr = format(startOfWeekVal, "yyyy-MM-dd");
      memo[startOfWeekStr] ||= [];
      memo[startOfWeekStr].push(entry);
      return memo;
    },
    {},
  );
  const weeks = Object.keys(entriesByWeek)
    .sort((a, b) => a.localeCompare(b))
    .map((dateString) => ({
      dateString,
      work: entriesByWeek[dateString].filter((entry) => entry.type === "work"),
      learnings: entriesByWeek[dateString].filter(
        (entry) => entry.type === "learning",
      ),
      interestingThings: entriesByWeek[dateString].filter(
        (entry) => entry.type === "interesting-thing",
      ),
    }));

  return (
    <div>
      <div className="mt-4">
        <p className="font-bold">
          Week of January 22<sup>nd</sup>
        </p>
      </div>

      <div className="my-8 border p-3">
        <EntryForm entry={{ date: format(new Date(), "yyyy-MM-dd") }} />
      </div>

      <div className="mt-12 space-y-12">
        {weeks.map((week) => (
          <div key={week.dateString}>
            <p className="font-bold">
              Week of {format(parseISO(week.dateString), "MMMM do")}
            </p>
            <div className="mt-3 space-y-4">
              {week.work.length > 0 && (
                <div>
                  <p>Work</p>
                  <ul className="ml-8 list-disc">
                    {week.work.map((entry) => (
                      <EntryListItem key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              )}
              {week.learnings.length > 0 && (
                <div>
                  <p>Learning</p>
                  <ul className="ml-8 list-disc">
                    {week.learnings.map((entry) => (
                      <EntryListItem key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              )}
              {week.interestingThings.length > 0 && (
                <div>
                  <p>Interesting things</p>
                  <ul className="ml-8 list-disc">
                    {week.interestingThings.map((entry) => (
                      <EntryListItem key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EntryListItem({
  entry,
}: {
  entry: Awaited<ReturnType<typeof loader>>[number];
}) {
  return (
    <li className="group">
      {entry.text}
      <Link
        to={`/entries/${entry.id}/edit`}
        className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100"
      >
        edit
      </Link>
    </li>
  );
}
