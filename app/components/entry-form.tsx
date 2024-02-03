import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { format } from "date-fns";

export function EntryForm({
  entry,
}: {
  entry?: { date: string; id: number; type: string; text: string };
}) {
  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (entry == null && fetcher.state === "idle" && textAreaRef.current) {
      textAreaRef.current.value = "";
      textAreaRef.current.focus();
    }
  }, [entry, fetcher.state]);

  return (
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
            defaultValue={entry?.date ?? format(new Date(), "yyyy-MM-dd")}
          />
        </div>
        <div className="mt-5 space-x-6">
          {[
            { label: "Work", value: "work" },
            { label: "Learning", value: "learning" },
            { label: "Interesting thing", value: "interesting-thing" },
          ].map((option) => (
            <label key={option.value}>
              <input
                className="mr-1"
                type="radio"
                name="type"
                value={option.value}
                defaultChecked={
                  entry ? entry.type === option.value : option.value === "work"
                }
              />
              {option.label}
            </label>
          ))}
        </div>
        <div className="mt-2">
          <textarea
            name="text"
            className="w-full text-gray-700"
            placeholder="Write your entry..."
            ref={textAreaRef}
            defaultValue={entry?.text}
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
  );
}
