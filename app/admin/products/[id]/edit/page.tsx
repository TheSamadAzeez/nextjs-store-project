import {
  fetchAdminProductDetails,
  updateProductAction,
  updateProductImageAction,
} from "@/utils/actions";

import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import { SubmitButton } from "@/components/form/Buttons";
import CheckboxInput from "@/components/form/CheckBoxInput";
import ImageInputContainer from "@/components/form/ImageInputContainer";

async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchAdminProductDetails(id);
  const { name, company, description, featured, price, image } = product;

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold capitalize">update product</h1>
      <div className="rounded-md border p-8">
        {/* Image Input Container */}
        <ImageInputContainer
          action={updateProductImageAction}
          name={name}
          image={image}
          text="update image"
        >
          {/* Hidden input fields */}
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="url" value={image} />
        </ImageInputContainer>

        <FormContainer action={updateProductAction}>
          <div className="my-4 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="id" value={id} />

            <FormInput
              type="text"
              name="name"
              label="product name"
              defaultValue={name}
            />

            <FormInput
              type="text"
              name="company"
              label="company"
              defaultValue={company}
            />

            <PriceInput defaultValue={price} />
          </div>

          <TextAreaInput
            name="description"
            label="product description"
            defaultValue={description}
          />

          <div className="mt-6">
            <CheckboxInput
              name="featured"
              label="featured"
              defaultChecked={featured}
            />
          </div>

          <SubmitButton text="update product" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
}

export default EditProductPage;
