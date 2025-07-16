"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CreateCollectionData, useCreateCollection } from "@/lib/hooks/useApi";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function CreateCollectionPage() {

    const { mutate: createCollection, isPending: isCreating } = useCreateCollection();
    const { toast } = useToast();
    const router = useRouter();
    const [formData, setFormData] = useState<CreateCollectionData>({
        name: "",
        description: "",
        price: 0,
        stock: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle collection creation logic 
        if (formData.name === "" || formData.description === "" || formData.price === 0 || formData.stock === 0) {
            toast({
                title: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }
        console.log("Creating collection:", formData);
        createCollection(formData, {
            onSuccess: () => {
                router.push('/');
            },
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Convert numeric fields to numbers
        if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? 0 : Number(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

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
                                <h1 className="text-2xl font-bold text-gray-900">Create Collection</h1>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Collection Details</CardTitle>
                                <CardDescription>
                                    Fill in the details for your new collection
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
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
                                        <Label htmlFor="startingPrice">Starting Price ($)</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            placeholder="0"
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
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Link href="/">
                                            <Button variant="outline" type="button" disabled={isCreating}>
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit" className="flex items-center space-x-2" disabled={isCreating}>
                                            <Save className="h-4 w-4" />
                                            <span>Create Collection</span>
                                        </Button>
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