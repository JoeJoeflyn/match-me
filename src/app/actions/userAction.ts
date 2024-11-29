"use server";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import {
  MemberEditSchema,
  memberEditSchema,
} from "@/lib/schemas/MemberEditSchema";
import { ActionResult } from "@/types";
import { Member, Photo } from "@prisma/client";
import { getAuthUserId } from "./authActions";

export async function updateMemberProfile(
  data: MemberEditSchema,
  nameUpdated: boolean
): Promise<ActionResult<Member>> {
  try {
    const userId = await getAuthUserId();
    const validated = memberEditSchema.safeParse(data);
    if (!validated.success)
      return { status: "error", error: validated.error.errors };
    const { name, description, city, country } = validated.data;
    if (nameUpdated) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }
    const member = await prisma.member.update({
      where: { userId },
      data: {
        name,
        description,
        city,
        country,
      },
    });
    return { status: "success", data: member };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}
export async function addImage(url: string, publicId: string) {
  try {
    const userId = await getAuthUserId();

    const newPhoto = await prisma.photo.create({
      data: {
        url,
        publicId,
        member: {
          connect: { userId },
        },
      },
      include: {
        member: true,
      },
    });

    await pusherServer.trigger(userId, "photo:add", newPhoto);

    await pusherServer.trigger("admin-photos", "photo:new", newPhoto);

    return newPhoto;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function setMainImage(photo: Photo) {
  try {
    if (!photo.isApproved)
      throw new Error("Only approved photos can be set to main image");
    const userId = await getAuthUserId();
    await prisma.user.update({
      where: { id: userId },
      data: { image: photo.url },
    });
    return prisma.member.update({
      where: { userId },
      data: { image: photo.url },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteImage(photo: Photo) {
  try {
    const userId = await getAuthUserId();
    if (photo.publicId) {
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }
    return prisma.member.update({
      where: { userId },
      data: {
        photos: {
          delete: { id: photo.id },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserInfoForNav() {
  try {
    const userId = await getAuthUserId();
    return prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
