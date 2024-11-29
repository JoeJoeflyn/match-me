import { getUserInfoForNav } from "@/app/actions/userAction";
import { auth } from "@/auth";
import { adminLinks, memberLinks } from "@/constant";
import { Button, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { Role } from "@prisma/client";
import Link from "next/link";
import { GiSelfLove } from "react-icons/gi";
import FiltersWrapper from "./FiltersWrapper";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";

export default async function TopNav() {
  const session = await auth();
  const userInfo = session?.user && (await getUserInfoForNav());

  const links = session?.user.role === Role.ADMIN ? adminLinks : memberLinks;

  return (
    <>
      <Navbar
        maxWidth="full"
        className="bg-gradient-to-r from-pink-400 via-red-400 to-pink-600"
        classNames={{
          item: [
            "text-xl",
            "text-white",
            "uppercase",
            "data-[active=true]:text-yellow-200",
          ],
        }}
      >
        <NavbarBrand as={Link} href="/">
          <GiSelfLove size={40} className="text-gray-200" />
          <div className="font-bold text-3xl flex">
            <span className="text-gray-200">MatchMe</span>
          </div>
        </NavbarBrand>
        <NavbarContent justify="center">
          {session &&
            links.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
        </NavbarContent>
        <NavbarContent justify="end">
          {userInfo ? (
            <UserMenu userInfo={userInfo} />
          ) : (
            <>
              <Button
                as={Link}
                href="/login"
                variant="bordered"
                className="text-white"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/register"
                variant="bordered"
                className="text-white"
              >
                Register
              </Button>
            </>
          )}
        </NavbarContent>
      </Navbar>
      <FiltersWrapper />
    </>
  );
}
