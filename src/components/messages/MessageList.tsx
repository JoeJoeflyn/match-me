"use client";
import useMessageStore from "@/hooks/useMessageStore";
import { pusherClient } from "@/lib/pusher";
import { formatShortDateTime } from "@/lib/util";
import { MessageDto } from "@/types";
import React from "react";
import { useShallow } from "zustand/react/shallow";
import MessageBox from "./MessageBox";

type Props = {
  initialMessages: {
    messages: MessageDto[];
    readCount: number;
  };
  currentUserId: string;
  chatId: string;
};

export default function MessageList({
  initialMessages,
  currentUserId,
  chatId,
}: Props) {
  const [messages, setMessages] = React.useState(initialMessages.messages);
  const setReadCount = React.useRef(false);
  const { updateUnreadCount } = useMessageStore(
    useShallow((state) => ({
      updateUnreadCount: state.updateUnreadCount,
    }))
  );

  React.useEffect(() => {
    if (!setReadCount.current) {
      updateUnreadCount(-initialMessages.readCount);
      setReadCount.current = true;
    }
  }, [initialMessages.readCount, updateUnreadCount]);

  const handleNewMessage = React.useCallback((message: MessageDto) => {
    setMessages((prevState) => {
      return [...prevState, message];
    });
  }, []);

  const handleReadMessages = React.useCallback((messageIds: string[]) => {
    setMessages((prevState) =>
      prevState.map((message) =>
        messageIds.includes(message.id)
          ? {
            ...message,
            dateRead: formatShortDateTime(new Date()),
          }
          : message
      )
    );
  }, []);

  React.useEffect(() => {
    const channel = pusherClient.subscribe(chatId);
    channel.bind("message:new", handleNewMessage);
    channel.bind("messages:read", handleReadMessages);
    return () => {
      channel.unsubscribe();
      channel.unbind("message:new", handleNewMessage);
      channel.unbind("messages:read", handleReadMessages);
    };
  }, [chatId]);

  return (
    <div>
      {messages.length === 0 ? (
        "No messages to display"
      ) : (
        <>
          {messages.map((message) => (
            <MessageBox
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))}
        </>
      )}
    </div>
  );
}
