import { ActionFunctionArgs } from "@remix-run/node";
import { Outlet, redirect } from "@remix-run/react";

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const searchWord = formData.get("word") as string;

  return redirect(`/search/${searchWord}`);
}

export default function Search() {
  return (
    <div>
      <header className="flex flex-col justify-center items-center">
        <h1 className="p-2 text-center md:text-left">Dictionary Search</h1>
        
        <form method="POST" action="/search" className="w-full flex justify-center mt-2 md:mt-0" aria-label="Search Form">
          <label htmlFor="search-word" className="sr-only">Search for a word</label>
          <input id="search-word" name="word" className="px-2 w-full md:w-1/2" placeholder="Search for a word..." required aria-required="true" />
          <button type="submit" className="rounded-none h-full" aria-label="Search">Search</button>
        </form>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
