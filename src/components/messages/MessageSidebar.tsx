"use client";
import { items } from "@/constant";
import useMessageStore from "@/hooks/useMessageStore";
import { Chip } from "@nextui-org/react";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useShallow } from "zustand/react/shallow";

export default function MessageSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = React.useState<string>(
    searchParams.get("container") || "inbox"
  );

  const handleSelect = (key: string) => {
    setSelected(key);
    const params = new URLSearchParams();
    params.set("container", key);
    router.replace(`${pathname}?${params}`);
  };

  const { unreadCount } = useMessageStore(
    useShallow((state) => ({
      unreadCount: state.unreadCount,
    }))
  );

  return (
    <div className="flex flex-col shadow-md rounded-lg cursor-pointer">
      {items.map(({ key, icon: Icon, label, chip }) => (
        <div
          key={key}
          className={clsx("flex flex-row items-center rounded-t-lg gap-2 p-3", {
            "text-default font-semibold": selected === key,
            "text-black hover:text-default/70": selected !== key,
          })}
          onClick={() => handleSelect(key)}
        >
          <Icon size={24} />
          <div className="flex justify-between flex-grow">
            <span>{label}</span>
            {chip && <Chip>{unreadCount}</Chip>}
          </div>
        </div>
      ))}
    </div>
  );
}