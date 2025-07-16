"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormCard } from "@/components/ui/FormCard";
import { BidForm } from "@/components/bids/BidForm";
import { useCreateBid } from "@/lib/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

export default function PlaceBidPage() {
    const searchParams = useSearchParams();
    const collectionId = searchParams.get('collectionId');
    const router = useRouter();
    const { mutate: createBid, isPending: isCreatingBid } = useCreateBid();
    const { toast } = useToast();

    const handleSubmit = (price: number) => {
        if (!collectionId) {
            console.error('Collection ID is required');
            return;
        }
        if (price <= 0) {
            toast({
                title: 'Bid amount must be greater than 0',
                variant: 'destructive',
            });
            return;
        }

        createBid({
            collectionId,
            price
        }, {
            onSuccess: () => {
                router.push(`/collections`);
            }
        });
    };

    return (
        <ProtectedRoute>
            <PageLayout
                title="Place Bid"
                showBackButton
                backHref="/collections"
                showCreateButton={false}
                showCollectionsButton={false}
            >
                <div className="max-w-4xl mx-auto">
                    <FormCard
                        title="Place Your Bid"
                        description="Enter your bid amount for this collection"
                    >
                        <BidForm
                            onSubmit={handleSubmit}
                            isSubmitting={isCreatingBid}
                            submitText="Place Bid"
                            cancelHref="/collections"
                        />
                    </FormCard>
                </div>
            </PageLayout>
        </ProtectedRoute>
    );
} 