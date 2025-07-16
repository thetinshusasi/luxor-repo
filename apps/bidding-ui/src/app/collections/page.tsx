"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageLayout } from "@/components/layout/PageLayout";
import { CollectionsList } from "@/components/collections/CollectionsList";
import { useAcceptBid, useRejectBid, useDeleteBid, Collection, useAllBidsByCollectionIds, CollectionBid, useAllUserCollectionExcludeCurrentUser } from "@/lib/hooks/useApi";
import { CollectionBids } from "@/lib/models/interfaces/collectionBids";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export default function CollectionsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // TanStack Query hooks
    const acceptBidMutation = useAcceptBid();
    const rejectBidMutation = useRejectBid();
    const deleteBidMutation = useDeleteBid();
    const { data: {
        data: collectionsData = [],
        totalPages,
    } = {}, isLoading: collectionsLoading, error: collectionsError, refetch: collectionsRefetch } = useAllUserCollectionExcludeCurrentUser(currentPage, itemsPerPage);

    const { data: allBidsByCollectionIdsData, } = useAllBidsByCollectionIds(collectionsData.map((collection: Collection) => collection.id));

    const collectionIdAndBidsMap = new Map<string, CollectionBid[]>();
    allBidsByCollectionIdsData?.forEach((collectionBidList: CollectionBids) => {
        collectionIdAndBidsMap.set(collectionBidList.collectionId, collectionBidList.bids);
    });

    useEffect(() => {
        collectionsRefetch();
    }, [currentPage, itemsPerPage, collectionsRefetch]);

    const handleAcceptBid = (bidId: string, collectionId: string) => {
        acceptBidMutation.mutate({ bidId, collectionId });
    };

    const handleRejectBid = (bidId: string, collectionId: string) => {
        rejectBidMutation.mutate({ bidId, collectionId });
    };

    const handleDeleteBid = (bidId: string) => {
        deleteBidMutation.mutate(bidId);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (collectionsLoading) {
        return (
            <ProtectedRoute>
                <LoadingSpinner message="Loading collections..." />
            </ProtectedRoute>
        );
    }

    if (collectionsError) {
        return (
            <ProtectedRoute>
                <ErrorDisplay
                    message={`Error loading collections: ${collectionsError.message}`}
                    onRetry={() => collectionsRefetch()}
                    retryText="Retry"
                />
            </ProtectedRoute>
        );
    }

    const collections = collectionsData || [];

    return (
        <ProtectedRoute>
            <PageLayout
                title="Other Collections"
                showCreateButton={true}
                showCollectionsButton={false}
            >
                <CollectionsList
                    collections={collections}
                    bidsMap={collectionIdAndBidsMap}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onAcceptBid={handleAcceptBid}
                    onRejectBid={handleRejectBid}
                    onDeleteBid={handleDeleteBid}
                    showEditButtons={false}
                    showDeleteButtons={false}
                    showPlaceBidButton={true}
                />
            </PageLayout>
        </ProtectedRoute>
    );
} 