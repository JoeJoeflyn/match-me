import { Provider, providers } from "@/constant";
import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";

export default function SocialLogin() {
  const onClick = (provider: Provider) => {
    signIn(provider, {
      callbackUrl: "/members",
    });
  };

  return (
    <div className="flex items-center w-full gap-2">
      {providers.map((provider) => (
        <Button
          key={provider.name}
          size="lg"
          fullWidth
          variant="bordered"
          onClick={() => onClick(provider.name as Provider)}
        >
          <provider.icon size={20} />
        </Button>
      ))}
    </div>
  );
}
