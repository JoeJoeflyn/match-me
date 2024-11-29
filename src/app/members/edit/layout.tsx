import { getAuthUserId } from "@/app/actions/authActions";
import { getMemberByUserId } from "@/app/actions/memberAction";
import MemberSidebar from "@/components/member/MemberSidebar";
import { navLinks } from "@/constant";
import { Card, CardHeader, Divider } from "@nextui-org/react";
import { notFound } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);
  if (!member) return notFound();

  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh]">
      <div className="col-span-3">
        <MemberSidebar member={member} navLinks={navLinks} />
      </div>
      <div className="col-span-9">
        <Card className="w-full mt-10 h-[80vh]">
          <CardHeader className="text-2xl font-semibold text-default">
            Edit Profile
          </CardHeader>
          <Divider />
          {children}
        </Card>
      </div>
    </div>
  );
}
