import { Separator } from "@/components/ui/separator";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h2 className="p-4 text-2xl">Dashboard</h2>
      <Separator />
      <section className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-2">
          <Sidebar />
        </div>
        <div className="px-4 lg:col-span-10">{children}</div>
      </section>
    </>
  );
}
export default DashboardLayout;
