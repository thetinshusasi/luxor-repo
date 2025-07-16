"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, DollarSign } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateBid } from "@/lib/hooks/useApi";
import { toast } from "@/hooks/use-toast";

export default function PlaceBidPage() {
    const searchParams = useSearchParams();
    const collectionId = searchParams.get('collectionId');
    const router = useRouter();
    const { mutate: createBid, isPending: isCreatingBid } = useCreateBid();

    const [formData, setFormData] = useState({
        price: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!collectionId) {
            console.error('Collection ID and bid amount are required');
            return;
        }
        if (formData.price <= 0) {
            toast({
                title: 'Bid amount must be greater than 0',
                variant: 'destructive',
            });
            return;
        }

        createBid({
            collectionId,
            price: formData.price
        },
            {
                onSuccess: () => {
                    router.push(`/collections`);
                }
            }
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                                <Link href="/collections">
                                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        <span>Back</span>
                                    </Button>
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">Place Bid</h1>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Place Your Bid</CardTitle>
                                <CardDescription>
                                    Enter your bid amount for this collection
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Bid Amount ($)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                placeholder="0"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                className="pl-10"
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Link href="/collections">
                                            <Button variant="outline" type="button" disabled={isCreatingBid}>
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit" className="flex items-center space-x-2" disabled={isCreatingBid}>
                                            <DollarSign className="h-4 w-4" />
                                            <span>{isCreatingBid ? 'Placing Bid...' : 'Place Bid'}</span>
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