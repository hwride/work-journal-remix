import { PrismaClient } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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

export default function EditPage() {
  const entry = useLoaderData<typeof loader>();

  return (
    <div className="mt-4">
      <p>Editing entry {entry.id}</p>
    </div>
  );
}
