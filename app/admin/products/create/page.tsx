import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
          <div className='mb-2'>
            <Label htmlFor='name'>ProductName</Label>
            <Input id='name' name='name' type='text' defaultValue={name} />
          </div>
          <Button type='submit' size='lg'>
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
}
export default CreateProductsPage;
