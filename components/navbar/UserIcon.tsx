import { LuUser } from "react-icons/lu";
// import { auth } from '@clerk/nextjs/server';
import { currentUser } from "@clerk/nextjs/server";

async function UserIcon() {
  // const { userId } = await auth();

  const user = await currentUser();
  const profileImage = user?.imageUrl;

  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt="user image"
        className="h-7 w-7 rounded-full object-cover"
      />
    );
  }

  return <LuUser className="h-7 w-7 rounded-full bg-primary text-white" />;
}

export default UserIcon;
