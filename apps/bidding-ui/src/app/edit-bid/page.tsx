"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useGetCollectionById, useUpdateBid, Collection, BidStatus } from "@/lib/hooks/useApi";

export default function EditBidPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bidId = searchParams.get('bidId');
    const collectionId = searchParams.get('collectionId');
    const priceFromParams = searchParams.get('price');

    const [price, setPrice] = useState<number>(parseFloat(priceFromParams || '0'));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch collection details
    const { data: collection, isLoading: collectionLoading, error: collectionError } = useGetCollectionById(collectionId || '');

    // Update bid mutation
    const updateBidMutation = useUpdateBid();

    useEffect(() => {
        if (!bidId || !collectionId) {
            setError('Missing bid or collection information');
            return;
        }

        // Set initial price from collection if available
        setPrice(parseFloat(priceFromParams || '0'));
    }, [bidId, collectionId, collection, priceFromParams]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers and decimal points
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setPrice(parseFloat(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bidId || !price || isNaN(Number(price))) {
            setError('Please enter a valid price');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await updateBidMutation.mutateAsync({
                bidId,
                data: { price: Number(price) }
            });

            // Navigate back to collections page
            router.push('/collections');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update bid');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/collections');
    };

    if (!bidId || !collectionId) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600">Missing bid or collection information</p>
                        <Button onClick={() => router.push('/collections')} className="mt-4">
                            Back to Collections
                        </Button>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (collectionLoading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading bid information...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (collectionError) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600">Error loading collection: {collectionError.message}</p>
                        <Button onClick={() => router.push('/collections')} className="mt-4">
                            Back to Collections
                        </Button>
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
                                <Button
                                    variant="ghost"
                                    onClick={handleCancel}
                                    className="flex items-center space-x-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Back</span>
                                </Button>
                                <h1 className="text-2xl font-bold text-gray-900">Edit Bid</h1>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Your Bid</CardTitle>
                                {collection && (
                                    <div className="text-sm text-gray-600">
                                        <p>Collection: {collection.name}</p>
                                        <p>Current Collection Price: ${collection.price}</p>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Bid Price ($)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={price}
                                            onChange={handlePriceChange}
                                            placeholder="Enter your bid price"
                                            className="w-full"
                                            required
                                        />
                                        <p className="text-xs text-gray-500">
                                            Enter a price higher than the current collection price to make your bid competitive.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={isLoading}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading || !price || isNaN(Number(price))}
                                            className="flex-1"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Update Bid
                                                </>
                                            )}
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