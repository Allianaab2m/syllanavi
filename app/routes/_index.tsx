import ClassRoute, { loader as ClassLoader } from "./class._index";

export const loader = ClassLoader;
export default function Index() {
  return <ClassRoute />;
}
