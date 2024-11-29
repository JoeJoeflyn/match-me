import { pusherClient } from "@/lib/pusher";
import { Photo } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

type LoadingAction = "main" | "delete";

type LoadingState = {
  type: string;
  isLoading: boolean;
  id: string;
};

type UsePhotoParams = {
  photos: Photo[] | null;
  userId?: string;
  mainImageUrl?: string | null;
  isAdmin: boolean;
  setMainImage: (photo: Photo) => Promise<any>;
  deleteImage: (photo: Photo) => Promise<any>;
};

export const usePhoto = ({
  photos,
  userId,
  mainImageUrl,
  isAdmin,
  setMainImage,
  deleteImage,
}: UsePhotoParams) => {
  const router = useRouter();
  const [photosArray, setPhotosArray] = React.useState(photos);
  const [loading, setLoading] = React.useState<LoadingState>({
    type: "",
    isLoading: false,
    id: "",
  });
  const adminChannelRef = React.useRef<any>(null);
  const userChannelRef = React.useRef<any>(null);

  const photosToRender = photosArray ?? photos;

  const handleNewPhoto = React.useCallback((updatedPhoto: Photo) => {
    setPhotosArray((prevPhotos) => {
      if (!prevPhotos) return [updatedPhoto];

      const updatedPhotos = prevPhotos.map((photo) =>
        photo.id === updatedPhoto.id ? updatedPhoto : photo
      );

      if (!updatedPhotos.some((photo) => photo.id === updatedPhoto.id)) {
        updatedPhotos.push(updatedPhoto);
      }

      return updatedPhotos;
    });
  }, []);

  const handlePhotoDelete = React.useCallback((photoId: string) => {
    setPhotosArray(
      (prevPhotos) =>
        prevPhotos?.filter((photo) => photo.id !== photoId) || null
    );
  }, []);

  const handlePhotoAdminApprove = React.useCallback(
    ({ photoId, isApproved }: { photoId: string; isApproved: true }) => {
      if (isAdmin && isApproved) {
        setPhotosArray(
          (prevPhotos) =>
            prevPhotos?.filter((photo) => photo.id !== photoId) || null
        );
      }
    },
    [isAdmin]
  );

  React.useEffect(() => {
    if (!adminChannelRef.current) {
      adminChannelRef.current = pusherClient.subscribe("admin-photos");
      adminChannelRef.current.bind("photo:new", handleNewPhoto);
      adminChannelRef.current.bind("photo:delete", handlePhotoAdminApprove);
    }

    if (userId && !userChannelRef.current) {
      userChannelRef.current = pusherClient.subscribe(userId);
      userChannelRef.current.bind("photo:add", handleNewPhoto);
      userChannelRef.current.bind("photo:delete", handlePhotoDelete);
    }

    return () => {
      if (adminChannelRef.current) {
        adminChannelRef.current.unsubscribe();
        adminChannelRef.current.unbind("photo:new", handleNewPhoto);
        adminChannelRef.current.unbind("photo:delete", handlePhotoAdminApprove);
        adminChannelRef.current = null;
      }

      if (userChannelRef.current) {
        userChannelRef.current.unsubscribe();
        userChannelRef.current.unbind("photo:add", handleNewPhoto);
        userChannelRef.current.unbind("photo:delete", handlePhotoDelete);
        userChannelRef.current = null;
      }
    };
  }, [userId, handleNewPhoto, handlePhotoDelete, handlePhotoAdminApprove]);

  const handleLoadingAction = async (
    photo: Photo,
    action: LoadingAction,
    actionFn: (photo: Photo) => Promise<any>
  ) => {
    if (photo.url === mainImageUrl) return null;

    setLoading({
      isLoading: true,
      id: photo.id,
      type: action,
    });

    try {
      await actionFn(photo);
      if (action === "delete") {
        setPhotosArray((prevPhotos) =>
          prevPhotos ? prevPhotos.filter((p) => p.id !== photo.id) : null
        );
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading({
        isLoading: false,
        id: "",
        type: "",
      });
    }
  };

  const onSetMain = (photo: Photo) =>
    handleLoadingAction(photo, "main", setMainImage);

  const onDelete = (photo: Photo) =>
    handleLoadingAction(photo, "delete", deleteImage);

  return {
    photosToRender,
    loading,
    onSetMain,
    onDelete,
    handleNewPhoto,
    handlePhotoDelete,
    setPhotosArray,
  };
};
