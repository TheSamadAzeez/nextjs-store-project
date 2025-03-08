"use client";

// Import necessary components and icons
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { LuShare2 } from "react-icons/lu";

import {
  TwitterShareButton,
  EmailShareButton,
  LinkedinShareButton,
  TwitterIcon,
  EmailIcon,
  LinkedinIcon,
} from "react-share";

// Define the ShareButton component
function ShareButton({ productId, name }: { productId: string; name: string }) {
  const url = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const productUrl = `${url}/products/${productId}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="p-2">
          <LuShare2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="flex items-center gap-x-2 justify-center w-full"
      >
        {/* Twitter Share Button */}
        <TwitterShareButton url={productUrl} title={name}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        {/* LinkedIn Share Button */}
        <LinkedinShareButton url={productUrl} title={name}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>

        {/* Email Share Button */}
        <EmailShareButton url={productUrl} title={name}>
          <EmailIcon size={32} round />
        </EmailShareButton>
      </PopoverContent>
    </Popover>
  );
}

export default ShareButton;
