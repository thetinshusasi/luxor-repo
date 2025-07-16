"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeleteCollection, useGetCollectionById, useUpdateCollection } from "@/lib/hooks/useApi";
interface FormData {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function EditCollectionPage() {

  const searchParams = useSearchParams();
  const { mutate: deleteCollection, isPending: isDeleting } = useDeleteCollection();
  const { mutate: updateCollection, isPending: isUpdating } = useUpdateCollection();
  const router = useRouter();
  const id = searchParams.get('id');
  const { data: collection, isLoading, error, refetch: refetchCollection } = useGetCollectionById(id as string);




  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });

  // Simulate loading existing collection data
  useEffect(() => {
    // In a real app, you'd fetch this from your API
    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description,
        price: Number(collection.price),
        stock: Number(collection.stock),
      });
    }
  }, [collection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle collection update logic here
    const { name, description, price, stock } = formData;
    console.log('Submitting form data:', { name, description, price, stock, priceType: typeof price, stockType: typeof stock });
    updateCollection({
      id: id as string,
      data: {
        name,
        description,
        price,
        stock,
      }
    });
  };

  const handleDelete = () => {
    deleteCollection(id as string, {
      onSuccess: () => {
        router.push('/');
      },
      onError: (error) => {
        console.error('Error deleting collection:', error);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    console.log('Input change:', { name, value, type, valueType: typeof value });

    // Convert numeric fields to numbers
    if (type === 'number') {
      const numericValue = value === '' ? 0 : Number(value);
      console.log('Converting to number:', { name, value, numericValue, numericValueType: typeof numericValue });
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading collection...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading collection: {error.message}</p>
            <Button onClick={() => refetchCollection()} className="mr-2">
              Retry
            </Button>
            <Link href="/">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Edit Collection</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle>Edit Collection</CardTitle>
                <CardDescription>
                  Update the details for your collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter collection title"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter collection description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>



                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Collection</span>
                    </Button>

                    <div className="flex space-x-4">
                      <Link href="/">
                        <Button variant="outline" type="button">
                          Cancel
                        </Button>
                      </Link>
                      <Button type="submit" className="flex items-center space-x-2" onClick={handleSubmit} disabled={isDeleting}>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 