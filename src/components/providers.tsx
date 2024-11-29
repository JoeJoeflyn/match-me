"use client";
import { getUnreadMessageCount } from "@/app/actions/messageActions";
import useMessageStore from "@/hooks/useMessageStore";
import { useNotificationChannel } from "@/hooks/useNotificationChannel";
import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useShallow } from "zustand/react/shallow";

export default function Providers({
  children,
  userId,
  profileComplete,
}: {
  children: React.ReactNode;
  userId: string | null;
  profileComplete: boolean;
}) {
  const isUnreadCountSet = React.useRef(false);
  const { updateUnreadCount } = useMessageStore(
    useShallow((state) => ({
      updateUnreadCount: state.updateUnreadCount,
    }))
  );
  const setUnreadCount = React.useCallback(
    (amount: number) => {
      updateUnreadCount(amount);
    },
    [updateUnreadCount]
  );
  React.useEffect(() => {
    if (!isUnreadCountSet.current && userId) {
      getUnreadMessageCount().then((count) => {
        setUnreadCount(count);
      });
      isUnreadCountSet.current = true;
    }
  }, [setUnreadCount, userId]);
  usePresenceChannel(userId, profileComplete);
  useNotificationChannel(userId, profileComplete);
  return (
    <SessionProvider>
      <NextUIProvider>
        <ToastContainer position="bottom-right" hideProgressBar />
        {children}
      </NextUIProvider>
    </SessionProvider>
  );
}
