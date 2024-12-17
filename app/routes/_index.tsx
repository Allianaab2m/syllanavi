import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"
import { client } from "~/client"

export const meta: MetaFunction = () => {
  return [{ title: "Syllanavi" }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const res = await client(request).api.lectures.$get()
  return res.json()
}

export default function Index() {
  const res = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>Syllanavi</h1>
      {res.map((l) => (
        <div key={l.id}>
          <h2>{l.name}</h2>
        </div>
      ))}
    </div>
  )
}
