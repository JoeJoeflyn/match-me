import ListsTab from "@/components/ListsTab";
import {
  fetchCurrentUserLikeIds,
  fetchLikedMembers,
} from "../actions/likeActions";

export const dynamic = "force-dynamic";

export default async function ListsPage({
  searchParams,
}: {
  searchParams: Promise<{ type: string }>;
}) {
  const [params, likeIds] = await Promise.all([
    searchParams,
    fetchCurrentUserLikeIds(),
  ]);

  const members = await fetchLikedMembers(params.type);

  return (
    <div>
      <ListsTab members={members} likeIds={likeIds} />
    </div>
  );
}
