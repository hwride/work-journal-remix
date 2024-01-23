import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

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
