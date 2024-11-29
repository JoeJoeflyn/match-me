import { pusherClient } from "@/lib/pusher";
import { MessageDto } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";
import { Channel } from "pusher-js";
import React from "react";
import { useShallow } from "zustand/react/shallow";
import useMessageStore from "./useMessageStore";
import { messageToast } from "@/components/Toast/MessageToast";
import { likeToast } from "@/components/Toast/LikeToast";

export const useNotificationChannel = (userId: string | null, profileComplete: boolean) => {
  const channelRef = React.useRef<Channel | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { add, updateUnreadCount } = useMessageStore(
    useShallow((state) => ({
      add: state.add,
      updateUnreadCount: state.updateUnreadCount,
    }))
  );
  const handleNewMessage = React.useCallback(
    (message: MessageDto) => {
      if (
        pathname === "/messages" &&
        searchParams.get("container") !== "outbox"
      ) {
        add(message);
        updateUnreadCount(1);
      } else if (pathname !== `/members/${message.senderId}/chat`) {
        updateUnreadCount(1);
        messageToast(message);
      }
    },
    [add, pathname, searchParams, updateUnreadCount]
  );
  const handleNewLike = React.useCallback(
    (data: { name: string; image: string | null; userId: string }) => {
      likeToast(data.name, data.image, data.userId);
    },
    []
  );
  React.useEffect(() => {
    if (!userId || !profileComplete) return;
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe(`private-${userId}`);
      channelRef.current.bind("message:new", handleNewMessage);
      channelRef.current.bind("like:new", handleNewLike);
    }
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind("message:new", handleNewMessage);
        channelRef.current.unbind("like:new", handleNewLike);
        channelRef.current = null;
      }
    };
  }, [userId, handleNewMessage, profileComplete])
};
