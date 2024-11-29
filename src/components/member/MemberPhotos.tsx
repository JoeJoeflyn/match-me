"use client";
import { deleteImage, setMainImage } from "@/app/actions/userAction";
import { usePhoto } from "@/hooks/usePhoto";
import { useRole } from "@/hooks/useRole";
import { Photo, Role } from "@prisma/client";
import DeleteButton from "../photo/DeleteButton";
import StarButton from "../photo/StarButton";
import MemberImage from "./MemberImage";

type Props = {
  userId?: string;
  photos: Photo[] | null;
  editing?: boolean;
  mainImageUrl?: string | null;
};

export default function MemberPhotos({
  userId,
  photos,
  editing,
  mainImageUrl,
}: Props) {
  const role = useRole();
  const isAdmin = role === Role.ADMIN;
  const { photosToRender, loading, onSetMain, onDelete } = usePhoto({
    photos,
    userId,
    mainImageUrl,
    isAdmin,
    setMainImage,
    deleteImage,
  });

  return (
    <div className="grid grid-cols-5 gap-3 p-5">
      {photosToRender &&
        photosToRender.map((photo) => (
          <div key={photo.id} className="relative">
            <MemberImage photo={photo} />
            {editing && (
              <>
                <div
                  onClick={() => onSetMain(photo)}
                  className="absolute top-3 left-3 z-50"
                >
                  <StarButton
                    selected={photo.url === mainImageUrl}
                    loading={
                      loading.isLoading &&
                      loading.type === "main" &&
                      loading.id === photo.id
                    }
                  />
                </div>
                <div
                  onClick={() => onDelete(photo)}
                  className="absolute top-3 right-3 z-50"
                >
                  <DeleteButton
                    loading={
                      loading.isLoading &&
                      loading.type === "delete" &&
                      loading.id === photo.id
                    }
                  />
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  );
}
