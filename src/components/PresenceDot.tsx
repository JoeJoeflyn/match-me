import usePresenceStore from "@/hooks/usePresenceStore";
import { Member } from "@prisma/client";
import { GoDot, GoDotFill } from "react-icons/go";
import { useShallow } from "zustand/react/shallow";
type Props = {
  member: Member;
};
export default function PresenceDot({ member }: Props) {
  const { membersId } = usePresenceStore(
    useShallow((state) => ({
      membersId: state.membersId,
    }))
  );
  const isOnline = membersId.indexOf(member.userId) !== -1;
  if (!isOnline) return null;
  return (
    <>
      <GoDot
        size={36}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <GoDotFill size={32} className="fill-green-500 animate-pulse" />
    </>
  );
}
