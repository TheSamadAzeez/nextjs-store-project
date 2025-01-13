import { SubmitButton } from '@/components/form/Buttons';
import CheckboxInput from '@/components/form/CheckBoxInput';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import ImageInput from '@/components/form/ImageInput';
import PriceInput from '@/components/form/PriceInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import { createProductAction } from '@/utils/actions';
import { faker } from '@faker-js/faker';

function CreateProductsPage() {
  // generate random data for the form
  const name = faker.commerce.productName();
  const description = faker.lorem.paragraph({ min: 10, max: 12 });
  const company = faker.company.name();

  return (
    <section className='text-2xl font-semibold mb-8 capitalize'>
      create product
      <div className='border p-8 rounded-md'>
        <FormContainer action={createProductAction}>
          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <FormInput name='name' type='text' defaultValue={name} />

            <FormInput name='company' type='text' defaultValue={company} />

            <PriceInput />

            <ImageInput />
          </div>

          <TextAreaInput
            name='description'
            label='product description'
            defaultValue={description}
          />

          <div className='mt-6'>
            <CheckboxInput name='featured' label='featured' />
          </div>
          <SubmitButton text='create product' className='mt-8' />
        </FormContainer>
      </div>
    </section>
  );
}
export default CreateProductsPage;
