import { PrismaClient } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EntryForm } from "~/components/entry-form";

export async function loader({ params }: LoaderFunctionArgs) {
  const db = new PrismaClient();
  const entry = await db.entry.findUnique({
    where: { id: Number(params.entryId) },
  });

  if (entry == null) {
    throw new Response("Not found", { status: 404 });
  }

  return {
    ...entry,
    date: entry?.date.toISOString().substring(0, 10),
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
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

  await db.entry.update({
    where: { id: Number(params.entryId) },
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });
  return redirect("/");
}

export default function EditPage() {
  const entry = useLoaderData<typeof loader>();

  return (
    <div className="mt-4">
      <p>Editing entry {entry.id}</p>
      <div className="mt-5">
        <EntryForm entry={entry} />
      </div>
    </div>
  );
}
