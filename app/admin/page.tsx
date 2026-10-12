import { redirect, RedirectType } from "next/navigation"

const AdminPage = () => {
  redirect('/admin/chunks', RedirectType.replace)
}

export default AdminPage