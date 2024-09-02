import Image from "next/image";
import Flow from "./components/Flow"
import AppRoutes from './AppRoutes';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <Flow />
    </main>
  );
}
