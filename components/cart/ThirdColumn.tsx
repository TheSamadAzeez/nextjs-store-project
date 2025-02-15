'use client';
import { useState } from 'react';
import SelectProductAmount from '../single-product/SelectProductAmount';
import { Mode } from '../single-product/SelectProductAmount';
import FormContainer from '../form/FormContainer';
import { SubmitButton } from '../form/Buttons';
import { removeCartItemAction, updateCartItemAction } from '@/utils/actions';
import { useToast } from '@/hooks/use-toast';

function ThirdColumn({ quantity, id }: { quantity: number; id: string }) {
  // State to manage the amount of product
  const [amount, setAmount] = useState(quantity);
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(false);
  // Toast hook for displaying messages
  const { toast } = useToast();

  // Function to handle amount change
  const handleAmountChange = async (value: number) => {
    setIsLoading(true);
    toast({ description: 'Updating cart item...' });
    const result = await updateCartItemAction({
      amount: value,
      cartItemId: id,
    });
    setAmount(value);
    toast({ description: result.message });
    setIsLoading(false);
  };

  return (
    <div className='md:ml-8'>
      {/* Component to select product amount */}
      <SelectProductAmount
        amount={amount}
        setAmount={handleAmountChange}
        mode={Mode.CartItem}
        isLoading={isLoading}
      />
      {/* Form to remove cart item */}
      <FormContainer action={removeCartItemAction}>
        <input type='hidden' name='id' value={id} />
        <SubmitButton size='sm' className='mt-4' text='remove' />
      </FormContainer>
    </div>
  );
}
export default ThirdColumn;
