import { redirect, RedirectType } from "next/navigation"

const AdminPage = () => {
  redirect('/admin/threads', RedirectType.replace)
}

export default AdminPage