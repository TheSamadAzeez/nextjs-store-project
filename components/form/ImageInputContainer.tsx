"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import FormContainer from "./FormContainer";
import ImageInput from "./ImageInput";
import { SubmitButton } from "./Buttons";
import { type actionFunction } from "@/utils/types";

type ImageInputContainerProps = {
  image: string;
  name: string;
  action: actionFunction;
  text: string;
  children?: React.ReactNode;
};

function ImageInputContainer(props: ImageInputContainerProps) {
  const { image, name, action, text } = props;
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

  return (
    <div className="mb-8">
      <Image
        src={image}
        alt={name}
        width={200}
        height={200}
        className="mb-4 h-[200px] w-[200px] rounded object-cover"
        priority
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsUpdateFormVisible((currentState) => !currentState)} // toggle form visibility
      >
        {text}
      </Button>

      {isUpdateFormVisible && (
        <div className="mt-4 max-w-md">
          <FormContainer action={action}>
            {props.children}
            <ImageInput />
            <SubmitButton size="sm" text={text} />
          </FormContainer>
        </div>
      )}
    </div>
  );
}

export default ImageInputContainer;
