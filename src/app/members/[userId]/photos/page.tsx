import { getMemberPhotosByUserId } from "@/app/actions/memberAction";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import { Image } from "@nextui-org/react";
import { Photo } from "@prisma/client";
export default async function PhotosPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const paramsUserId = await params;

  const photosObj = await getMemberPhotosByUserId(paramsUserId.userId);
  const { photos, image } = { ...photosObj };

  return (
    <CardInnerWrapper
      header="Photos"
      body={
        <div className="grid grid-cols-5 gap-3">
          {photos?.length ? (
            photos.map((photo: Photo) => (
              <div key={photo.id}>
                <Image
                  src={photo.url}
                  alt="Image of member"
                  className="object-cover aspect-square"
                />
              </div>
            ))
          ) : (
            <Image
              src={image!}
              alt="Image of member"
              className="object-cover aspect-square"
            />
          )}
        </div>
      }
    />
  );
}
