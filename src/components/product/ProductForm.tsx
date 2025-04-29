
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductFormData } from '@/types/product';
import { categories } from '@/types/product';
import ImageUploader from './ImageUploader';

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
  category: z.string(),
  featured: z.boolean().default(false),
  paymentLink: z.string().url({ message: "Must be a valid URL" }).optional(),
});

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  buttonText?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: categories[0],
    featured: false,
    paymentLink: '',
  },
  onSubmit,
  buttonText = 'Save Product',
}) => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleImageSelected = (imageUrl: string) => {
    form.setValue('imageUrl', imageUrl);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  {...field}
                  className="h-32"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <ImageUploader 
                  onImageSelected={handleImageSelected} 
                  initialImageUrl={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://payment.com/yourproduct"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured Product</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
          {buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
