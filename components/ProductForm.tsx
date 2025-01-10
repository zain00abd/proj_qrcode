"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveProduct } from '@/lib/storage';
import { ProductFormData } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
});

interface ProductFormProps {
  barcode: string;
  initialData?: ProductFormData;
  onSave: () => void;
}

export default function ProductForm({ barcode, initialData, onSave }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      price: 0,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    saveProduct(barcode, data.name, data.price);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          placeholder="Enter price"
        />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Save Product
      </Button>
    </form>
  );
}