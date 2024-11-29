import EmptyState from "@/components/EmptyState";
import MemberCard from "@/components/member/MemberCard";
import PaginationComponent from "@/components/PaginationComponent";
import { GetMemberParams } from "@/types";
import { fetchCurrentUserLikeIds } from "../actions/likeActions";
import { getMembers } from "../actions/memberAction";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<GetMemberParams>;
}) {
  const params = await searchParams;

  const { items: members, totalCount } = await getMembers(params);

  const likeIds = await fetchCurrentUserLikeIds();

  if (members.length === 0) return <EmptyState />;

  return (
    <>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
        {members &&
          members.map((member) => (
            <MemberCard member={member} key={member.id} likeIds={likeIds} />
          ))}
      </div>
      <PaginationComponent totalCount={totalCount} />
    </>
  );
}
