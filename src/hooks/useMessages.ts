import {
  deleteMessage,
  getMessagesByContainer,
} from "@/app/actions/messageActions";
import { inboxColumns, outboxColumns } from "@/constant";
import { MessageDto } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useShallow } from "zustand/react/shallow";
import useMessageStore from "./useMessageStore";

export const useMessages = (
  initialMessages: MessageDto[],
  nextCursor?: string
) => {
  const { set, remove, messages, updateUnreadCount, resetMessages } =
    useMessageStore(
      useShallow((state) => ({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount,
        resetMessages: state.resetMessages,
      }))
    );
  const cursorRef = React.useRef(nextCursor);
  const searchParams = useSearchParams();
  const router = useRouter();
  const container = searchParams.get("container");
  const isOutbox = container === "outbox";
  const [isDeleting, setDeleting] = React.useState({
    id: "",
    loading: false,
  });
  const [loadingMore, setLoadingMore] = React.useState(false);

  React.useEffect(() => {
    set(initialMessages);
    cursorRef.current = nextCursor;

    return () => {
      resetMessages();
    };
  }, [initialMessages, set, nextCursor]);

  const loadMore = React.useCallback(async () => {
    if (cursorRef.current) {
      setLoadingMore(true);
      const { messages, nextCursor } = await getMessagesByContainer(
        container,
        cursorRef.current
      );
      set(messages);
      cursorRef.current = nextCursor;
      setLoadingMore(false);
    }
  }, [container, set]);

  const columns = isOutbox ? outboxColumns : inboxColumns;

  const handleDeleteMessage = React.useCallback(
    async (message: MessageDto) => {
      setDeleting({
        id: message.id,
        loading: true,
      });
      await deleteMessage(message.id, isOutbox);
      remove(message.id);
      if (!message.dateRead && !isOutbox) updateUnreadCount(-1);
      setDeleting({ id: "", loading: false });
    },
    [isOutbox, remove, updateUnreadCount]
  );
  const handleRowSelect = (key: React.Key) => {
    const message = messages.find((m) => m.id === key);
    const url = isOutbox
      ? `/members/${message?.recipientId}`
      : `/members/${message?.senderId}`;
    router.push(url + "/chat");
  };
  return {
    isOutbox,
    columns,
    deleteMessage: handleDeleteMessage,
    selectRow: handleRowSelect,
    isDeleting,
    messages,
    loadingMore,
    loadMore,
    hasMore: !!cursorRef.current,
  };
};
