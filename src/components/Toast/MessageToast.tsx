import { MessageDto } from "@/types";
import { toast } from "react-toastify";
import { NotificationToast } from "./Toast";

export const messageToast = (message: MessageDto) => {
  toast(
    <NotificationToast
      image={message.senderImage}
      href={`/members/${message.senderId}/chat`}
      title={`${message.senderName} has sent you a new message`}
    />
  );
};