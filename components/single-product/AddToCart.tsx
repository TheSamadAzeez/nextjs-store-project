"use client";
import { useState } from "react";
import SelectProductAmount from "./SelectProductAmount";
import { Mode } from "./SelectProductAmount";
import FormContainer from "../form/FormContainer";
import { SubmitButton } from "../form/Buttons";
import { addToCartAction } from "@/utils/actions";
import { useAuth } from "@clerk/nextjs";
import { ProductSignInButton } from "../form/Buttons";

// Component to add a product to the cart
function AddToCart({ productId }: { productId: string }) {
  // State to manage the amount of product to add
  const [amount, setAmount] = useState(1);
  // Get the user ID from authentication context
  const { userId } = useAuth();

  return (
    <div className="mt-4">
      {/* Component to select the amount of product */}
      <SelectProductAmount
        mode={Mode.SingleProduct}
        amount={amount}
        setAmount={setAmount}
      />
      {userId ? (
        // Form to add product to cart if user is authenticated
        <FormContainer action={addToCartAction}>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="amount" value={amount} />
          <SubmitButton text="add to cart" size="default" className="mt-8" />
        </FormContainer>
      ) : (
        // Button to prompt user to sign in if not authenticated
        <ProductSignInButton />
      )}
    </div>
  );
}

export default AddToCart;
