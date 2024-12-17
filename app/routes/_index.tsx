import type { MetaFunction } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"
import { client } from "~/client"

export const meta: MetaFunction = () => {
  return [{ title: "Syllanavi" }]
}

export async function loader() {
  const res = await client.api.posts.$get()
  return res.json()
}

function Card(props: { title: string; id: number; createdAt: string | null }) {
  return (
    <div>
      {props.title} {props.id} {props.createdAt}
    </div>
  )
}

export default function Index() {
  const res = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>Syllanavi</h1>
      {res.map((v, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <div key={i}>
          <Card {...v} />
        </div>
      ))}
    </div>
  )
}
