import { toast } from "react-toastify";
import { NotificationToast } from "./Toast";

export const likeToast = (
  name: string,
  image: string | null,
  userId: string
) => {
  toast(
    <NotificationToast
      image={image}
      href={`/members/${userId}`}
      title={`You have been liked by ${name}`}
      subtitle="Click here to view their profile"
    />
  );
};
