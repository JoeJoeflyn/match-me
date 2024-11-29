import { FaFemale, FaGithub, FaMale } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GoInbox } from "react-icons/go";
import { MdOutlineOutbox } from "react-icons/md";

export type Provider = "google" | "github";

export const tabs = [
  {
    id: "source",
    label: "Members I have liked",
  },
  {
    id: "target",
    label: "Members that like me",
  },
  { id: "mutual", label: "Mutual likes" },
];

export const basePath = `/members/edit`;

export const navLinks = [
  { name: "Edit Profile", href: `${basePath}` },
  {
    name: "Update Photos",
    href: `${basePath}/photos`,
  },
];

export const outboxColumns = [
  { key: "recipientName", label: "Recipient" },
  { key: "text", label: "Message" },
  { key: "created", label: "Date sent" },
  { key: "actions", label: "Actions" },
];
export const inboxColumns = [
  { key: "senderName", label: "Sender" },
  { key: "text", label: "Message" },
  { key: "created", label: "Date received" },
  { key: "actions", label: "Actions" },
];

export const items = [
  {
    key: "inbox",
    label: "Inbox",
    icon: GoInbox,
    chip: true,
  },
  {
    key: "outbox",
    label: "Outbox",
    icon: MdOutlineOutbox,
    chip: false,
  },
];

export const orderByList = [
  { label: "Last active", value: "updated" },
  { label: "Newest members", value: "created" },
];

export const genderList = [
  { value: "male", icon: FaMale },
  { value: "female", icon: FaFemale },
];

export const providers = [
  {
    name: "google",
    icon: FcGoogle,
    text: "Google",
  },
  {
    name: "github",
    icon: FaGithub,
    text: "GitHub",
  },
];

export const memberLinks = [
  { href: "/members", label: "Matches" },
  { href: "/lists", label: "Lists" },
  { href: "/messages", label: "Messages" },
];

export const adminLinks = [
  {
    href: "/admin/moderation",
    label: "Photo Moderation",
  },
];