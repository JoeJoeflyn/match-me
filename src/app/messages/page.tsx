import MessageSidebar from "@/components/messages/MessageSidebar";
import MessageTable from "@/components/messages/MessageTable";
import { getMessagesByContainer } from "../actions/messageActions";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ container: string }>;
}) {
  const params = await searchParams;
  const { messages, nextCursor } = await getMessagesByContainer(
    params.container
  );
  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh] mt-10">
      <div className="col-span-2">
        <MessageSidebar />
      </div>
      <div className="col-span-10">
        <MessageTable initialMessages={messages} nextCursor={nextCursor} />
      </div>
    </div>
  );
}
