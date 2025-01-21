import CarDetail from "@/components/CarDetail";

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return <CarDetail id={id} />;
}
