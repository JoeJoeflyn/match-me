import { authActions, MessageActions } from "@/app/actions";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import { ChatForm } from "@/components/chat";
import MessageList from "@/components/messages/MessageList";
import { createChatId } from "@/lib/util";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const userIdParams = await params;
  const messages = await MessageActions.getMessageThread(userIdParams.userId);
  const userId = await authActions.getAuthUserId();
  const chatId = createChatId(userId, userIdParams.userId);

  return (
    <CardInnerWrapper
      header="Chat"
      body={
        <MessageList
          initialMessages={messages}
          currentUserId={userId}
          chatId={chatId}
        />
      }
      footer={<ChatForm />}
    />
  );
}
