'use client';

import { RxReload } from 'react-icons/rx';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignInButton } from '@clerk/nextjs';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { LuTrash2 } from 'react-icons/lu';
import { TbEdit } from 'react-icons/tb';

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

/** SUBMIT BUTTON */
export function SubmitButton({
  className = '',
  text = 'submit',
  size = 'lg',
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      disabled={pending}
      className={cn('capitalize', className)}
      size={size}
    >
      {pending ? (
        <>
          <RxReload className='mr-2 h-4 w-4 animate-spin' />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

/** ICON BUTTON  */
type actionType = 'edit' | 'delete';

export function IconButton({ actionType }: { actionType: actionType }) {
  const { pending } = useFormStatus();

  const renderIcon = () => {
    switch (actionType) {
      case 'edit':
        return <TbEdit />;
      case 'delete':
        return <LuTrash2 />;
      default:
        const never: never = actionType;
        throw new Error(`Unhandled action type: ${never}`);
    }
  };

  return (
    <Button
      type='submit'
      size='icon'
      variant='link'
      className='p-2 cursor-pointer'
    >
      {pending ? <RxReload className='animate-spin' /> : renderIcon()}
    </Button>
  );
}
