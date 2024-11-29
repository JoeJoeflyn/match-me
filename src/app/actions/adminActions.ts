"use server";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { Photo, Role } from "@prisma/client";
import { getUserRole } from "./authActions";
import { pusherServer } from "@/lib/pusher";
export async function getUnapprovedPhotos() {
  try {
    const role = await getUserRole();
    if (role !== Role.ADMIN) throw new Error("Forbidden");
    return prisma.photo.findMany({
      where: {
        isApproved: false,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function approvePhoto(photoId: string) {
  try {
    const role = await getUserRole();
    if (role !== Role.ADMIN) throw new Error("Forbidden");
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { member: { include: { user: true } } },
    });
    if (!photo || !photo.member || !photo.member.user)
      throw new Error("Cannot approve this image");
    const { member } = photo;
    const userUpdate =
      member.user && member.user.image === null ? { image: photo.url } : {};
    const memberUpdate = member.image === null ? { image: photo.url } : {};
    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({
        where: { id: member.userId },
        data: userUpdate,
      });
    }

    const updatedPhoto = await prisma.member.update({
      where: { id: member.id },
      data: {
        ...memberUpdate,
        photos: {
          update: {
            where: { id: photo.id },
            data: { isApproved: true },
          },
        },
      },
      include: { photos: true },
    });

    const approvedPhoto = updatedPhoto.photos.find((p) => p.id === photoId);
    if (approvedPhoto) {
      await pusherServer.trigger(member.userId, "photo:add", {
        ...approvedPhoto,
        isApproved: true,
      });
    }

    await pusherServer.trigger("admin-photos", "photo:delete", {
      photoId: photo.id,
      isApproved: true,
    });

    return updatedPhoto;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function rejectPhoto(photo: Photo) {
  try {
    const role = await getUserRole();
    if (role !== Role.ADMIN) throw new Error("Forbidden");
    if (photo.publicId) {
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }

    const deletedPhoto = await prisma.photo.delete({
      where: { id: photo.id },
    });

    await pusherServer.trigger(photo.memberId, "photo:delete", photo.id);
    await pusherServer.trigger("admin-photos", "photo:delete", {
      photoId: photo.id,
      isApproved: true,
    });

    return deletedPhoto;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
