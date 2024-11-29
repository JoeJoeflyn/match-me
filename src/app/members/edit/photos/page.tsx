import { getAuthUserId } from "@/app/actions/authActions";
import {
  getMemberByUserId,
  getMemberPhotosByUserId,
} from "@/app/actions/memberAction";
import MemberPhotoUpload from "@/components/MemberPhotoUpload";
import MemberPhotos from "@/components/member/MemberPhotos";
import { CardBody } from "@nextui-org/react";

export default async function PhotosPage() {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);
  const photosObj = await getMemberPhotosByUserId(userId);
  const { photos } = { ...photosObj };

  return (
    <CardBody>
      <MemberPhotoUpload />
      <MemberPhotos
        photos={photos!}
        editing={true}
        mainImageUrl={member?.image}
        userId={userId}
      />
    </CardBody>
  );
}
