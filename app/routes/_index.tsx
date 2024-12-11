import type { MetaFunction } from "@remix-run/cloudflare"

export const meta: MetaFunction = () => {
  return [{ title: "Syllanavi" }]
}

export default function Index() {
  return <div>Syllanavi</div>
}
