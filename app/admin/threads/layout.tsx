import AdminHeader from "../threads/_components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>
    <AdminHeader />
    <div className="mt-25 px-4">
      { children }
    </div>
  </>
}
