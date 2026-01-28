import { redirect, RedirectType } from "next/navigation"

export default () => {
    redirect('/admin/threads', RedirectType.replace)
}