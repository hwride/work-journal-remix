import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const json = Object.fromEntries(formData);
  console.log("form data", json);
  return redirect("/");
}

export default function Index() {
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
        <Form method="post">
          <p className="italic">Create an entry</p>
          <div>
            <div className="mt-4">
              <input type="date" name="date" className="text-gray-700" />
            </div>
            <div className="mt-5 space-x-6">
              <label>
                <input
                  className="mr-1"
                  type="radio"
                  name="category"
                  value="work"
                />
                Work
              </label>
              <label>
                <input
                  className="mr-1"
                  type="radio"
                  name="category"
                  value="learning"
                />
                Learning
              </label>
              <label>
                <input
                  className="mr-1"
                  type="radio"
                  name="category"
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
              ></textarea>
            </div>

            <div className="mt-1 text-right">
              <button
                type="submit"
                className="bg-blue-500 px-4 py-1 font-medium text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </Form>
      </div>

      <div className="mt-3 space-y-4">
        <div>
          <p>Work</p>
          <ul className="ml-8 list-disc pl-4">
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
        <div>
          <p>Learnings</p>
          <ul className="ml-8 list-disc pl-4">
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
        <div>
          <p>Interesting things</p>
          <ul className="ml-8 list-disc pl-4">
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
