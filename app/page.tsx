"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Barcode, ListFilter } from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductForm from '@/components/ProductForm';
import ProductList from '@/components/ProductList';
import { getProductByBarcode } from '@/lib/storage';
import { ProductFormData } from '@/lib/types';

export default function Home() {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('scan');
  const [initialFormData, setInitialFormData] = useState<ProductFormData | undefined>();
  
  const handleScan = (barcode: string) => {
    setScannedBarcode(barcode);
    const existingProduct = getProductByBarcode(barcode);
    if (existingProduct) {
      setInitialFormData({
        name: existingProduct.name,
        price: existingProduct.price,
      });
    } else {
      setInitialFormData(undefined);
    }
  };

  const handleProductSave = () => {
    setScannedBarcode(null);
    setInitialFormData(undefined);
    setActiveTab('list');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Product Scanner
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <Barcode className="w-4 h-4" />
            Scan Product
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <ListFilter className="w-4 h-4" />
            Product List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scan">
          <Card>
            <CardContent className="pt-6">
              {!scannedBarcode ? (
                <BarcodeScanner onScan={handleScan} />
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-center">
                      Scanned Barcode: <span className="font-mono">{scannedBarcode}</span>
                    </p>
                  </div>
                  <ProductForm
                    barcode={scannedBarcode}
                    initialData={initialFormData}
                    onSave={handleProductSave}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <ProductList />
        </TabsContent>
      </Tabs>
    </div>
  );
}