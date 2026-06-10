import { notFound } from "next/navigation";
import AdminPanel from "./AdminPanel";

export default async function SecretPage({ params }) {
  const { token } = await params;

  const ADMIN_TOKEN =
    process.env.ADMIN_SECRET_TOKEN || "dws-admin-2024";

  if (token !== ADMIN_TOKEN) {
    notFound();
  }

  return <AdminPanel />;
}