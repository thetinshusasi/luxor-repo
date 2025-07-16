"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormCard } from "@/components/ui/FormCard";
import { BidForm } from "@/components/bids/BidForm";
import { useGetCollectionById, useUpdateBid } from "@/lib/hooks/useApi";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { useEffect, useState } from "react";

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

    const handleSubmit = async (price: number) => {
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

    if (!bidId || !collectionId) {
        return (
            <ProtectedRoute>
                <ErrorDisplay
                    message="Missing bid or collection information"
                    onRetry={() => router.push('/collections')}
                    retryText="Back to Collections"
                />
            </ProtectedRoute>
        );
    }

    if (collectionLoading) {
        return (
            <ProtectedRoute>
                <LoadingSpinner message="Loading bid information..." />
            </ProtectedRoute>
        );
    }

    if (collectionError) {
        return (
            <ProtectedRoute>
                <ErrorDisplay
                    message={`Error loading collection: ${collectionError.message}`}
                    onRetry={() => router.push('/collections')}
                    retryText="Back to Collections"
                />
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <PageLayout
                title="Edit Bid"
                showBackButton
                backHref="/collections"
                showCreateButton={false}
                showCollectionsButton={false}
            >
                <div className="max-w-2xl mx-auto">
                    <FormCard
                        title="Edit Your Bid"
                        description="Update your bid amount"
                    >
                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
                                {error}
                            </div>
                        )}
                        <BidForm
                            initialPrice={price}
                            onSubmit={handleSubmit}
                            isSubmitting={isLoading}
                            submitText="Update Bid"
                            cancelHref="/collections"
                            collectionName={collection?.name}
                            collectionPrice={collection?.price}
                        />
                    </FormCard>
                </div>
            </PageLayout>
        </ProtectedRoute>
    );
} 