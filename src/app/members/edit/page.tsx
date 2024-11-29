import { getAuthUserId } from "@/app/actions/authActions";
import { getMemberByUserId } from "@/app/actions/memberAction";
import EditForm from "@/components/form/EditForm";
import { CardBody } from "@nextui-org/react";
import { notFound } from "next/navigation";

export default async function MemberEditPage() {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);
  if (!member) return notFound();
  return (
    <CardBody>
      <EditForm member={member} />
    </CardBody>
  );
}
