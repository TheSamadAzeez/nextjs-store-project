import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/format";
import { createOrderAction } from "@/utils/actions";
import FormContainer from "../form/FormContainer";
import { SubmitButton } from "../form/Buttons";
import { Cart } from "@prisma/client";

// Component to display cart totals
function CartTotals({ cart }: { cart: Cart }) {
  // Destructure cart properties
  const { cartTotal, shipping, tax, orderTotal } = cart;
  return (
    <div>
      <Card className="p-8">
        {/* Display subtotal */}
        <CartTotalRow label="Subtotal" amount={cartTotal} />
        {/* Display shipping cost */}
        <CartTotalRow label="Shipping" amount={shipping} />
        {/* Display tax */}
        <CartTotalRow label="Tax" amount={tax} />
        <CardTitle className="mt-8">
          {/* Display order total */}
          <CartTotalRow label="Order Total" amount={orderTotal} lastRow />
        </CardTitle>
      </Card>
      {/* Form to place order */}
      <FormContainer action={createOrderAction}>
        <SubmitButton text="Place Order" className="mt-8 w-full" />
      </FormContainer>
    </div>
  );
}

// Component to display a row in the cart totals
function CartTotalRow({
  label,
  amount,
  lastRow,
}: {
  label: string;
  amount: number;
  lastRow?: boolean;
}) {
  return (
    <>
      {/* Display label and formatted amount */}
      <p className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{formatCurrency(amount)}</span>
      </p>
      {/* Display separator unless it's the last row */}
      {lastRow ? null : <Separator className="my-2" />}
    </>
  );
}

export default CartTotals;
