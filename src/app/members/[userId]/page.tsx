import { getMemberByUserId } from "@/app/actions/memberAction";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import { notFound } from "next/navigation";

export default async function MemberDetailedPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const paramsUserId = await params;

  const member = await getMemberByUserId(paramsUserId.userId);

  if (!member) return notFound();
  return <CardInnerWrapper header="Profile" body={member.description} />;
}
