import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

export function EntryForm({
  entry,
}: {
  entry: { date: string; id?: number; type?: string; text?: string };
}) {
  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (entry.text == null && fetcher.state === "idle" && textAreaRef.current) {
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
            defaultValue={entry.date}
          />
        </div>
        <div className="mt-5 space-x-6">
          <label>
            <input
              className="mr-1"
              type="radio"
              name="type"
              value="work"
              defaultChecked={entry.type === "work"}
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
              defaultChecked={entry.type === "learning"}
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
              defaultChecked={entry.type === "interesting-thing"}
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
            defaultValue={entry.text}
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
