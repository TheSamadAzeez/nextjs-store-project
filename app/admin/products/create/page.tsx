import FormInput from '@/components/form/FormInput';
import { Button } from '@/components/ui/button';
import { faker } from '@faker-js/faker';

const createProductsAction = async (formData: FormData) => {
  'use server';
  const name = formData.get('name') as string;
  console.log(name);
};

function CreateProductsPage() {
  // generate random data for the form
  const name = faker.commerce.productName();
  const description = faker.lorem.paragraph({ min: 10, max: 12 });
  const company = faker.company.name();

  return (
    <section className='text-2xl font-semibold mb-8 capitalize'>
      create product
      <div className='border p-8 rounded-md'>
        <form action={createProductsAction}>
          <FormInput
            name='name'
            type='text'
            label='product name'
            defaultValue={name}
            placeholder='Enter product name'
          />
          <Button type='submit' size='lg'>
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
}
export default CreateProductsPage;
