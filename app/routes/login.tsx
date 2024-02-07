import { Form, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const isAdmin = request.headers.get("cookie")?.match(/admin=1/);
  return {
    isAdmin,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);
  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Bad request");
  }
  if (email === "test@example.com" && password === "password") {
    console.log("success");
    return new Response("", {
      headers: {
        "Set-Cookie": "admin=1",
      },
    });
  } else {
    console.log("fail");
    return null;
  }
}

export default function LoginPage() {
  const data = useLoaderData<typeof loader>();
  console.log("data", data);

  return (
    <div className="mt-8">
      {data?.isAdmin ? (
        "You are signed in"
      ) : (
        <Form method="post">
          <input
            className="text-gray-900"
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            className="text-gray-900"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button
            type="submit"
            className="bg-blue-500 px-3 py-2 font-medium text-white"
          >
            Login
          </button>
        </Form>
      )}
    </div>
  );
}
