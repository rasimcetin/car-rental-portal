import UserDetail from "@/components/UserDetail";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  return <UserDetail params={{ id }} />;
}
