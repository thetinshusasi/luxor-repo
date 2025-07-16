"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Collection, CollectionBid } from "@/lib/hooks/useApi";
import { useAcceptBid, useRejectBid, useDeleteCollection, useUserDetails, useUserCollections, useAllBidsByCollectionIds } from "@/lib/hooks/useApi";
import { useAuth } from "@/lib/hooks/useAuth";
import { CollectionBids } from "@/lib/models/interfaces/collectionBids";
import { User as UserType } from "@/lib/hooks/useAuth";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { Header } from "@/components/layout/Header";
import { PaginationWrapper } from "@/components/ui/PaginationWrapper";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";

interface DashboardClientProps {
    initialPage?: number;
}

export function DashboardClient({ initialPage = 1 }: DashboardClientProps) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
    const itemsPerPage = 4;
    const router = useRouter();

    const { mutate: acceptBid } = useAcceptBid();
    const { mutate: rejectBid } = useRejectBid();
    const deleteCollectionMutation = useDeleteCollection();
    const { logout, setUser } = useAuth();

    const { data: userDetails, error: userDetailsError } = useUserDetails();
    const {
        data: { data: userCollectionsData = [], totalPages } = {},
        isLoading: userCollectionsLoading,
        error: userCollectionsError,
        refetch: userCollectionsRefetch
    } = useUserCollections(currentPage, itemsPerPage);

    const {
        data: allBidsByCollectionIdsData,
        isLoading: allBidsByCollectionIdsLoading,
        error: allBidsByCollectionIdsError
    } = useAllBidsByCollectionIds(userCollectionsData.map((collection: Collection) => collection.id));

    const collectionIdAndBidsMap = new Map<string, CollectionBid[]>();
    allBidsByCollectionIdsData?.forEach((collectionBidList: CollectionBids) => {
        collectionIdAndBidsMap.set(collectionBidList.collectionId, collectionBidList.bids);
    });

    useEffect(() => {
        if (userDetails) {
            setUser(userDetails as UserType);
            return;
        }
        if (userDetailsError) {
            setUser(null);
            return;
        }
    }, [userDetails, userDetailsError, setUser]);

    useEffect(() => {
        userCollectionsRefetch();
    }, [currentPage, itemsPerPage, userCollectionsRefetch]);

    const handleAcceptBid = (bidId: string, collectionId: string) => {
        acceptBid({ bidId, collectionId });
    };

    const handleRejectBid = (bidId: string, collectionId: string) => {
        rejectBid({ bidId, collectionId });
    };

    const handleDeleteCollection = (collectionId: string) => {
        setCollectionToDelete(collectionId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (collectionToDelete) {
            deleteCollectionMutation.mutate(collectionToDelete);
            setDeleteModalOpen(false);
            setCollectionToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setCollectionToDelete(null);
    };

    const handleEditCollection = (collectionId: string) => {
        router.push(`/edit-collection?id=${collectionId}`);
    };

    const handleLogout = () => {
        logout();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (userCollectionsLoading || allBidsByCollectionIdsLoading) {
        return <LoadingSpinner message="Loading collections..." />;
    }

    if (userCollectionsError) {
        return (
            <ErrorDisplay
                message={`Error loading collections: ${userCollectionsError.message}`}
                onRetry={handleLogout}
                retryText="Log out and try again"
            />
        );
    }

    const collections = userCollectionsData || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 gap-6">
                        {collections.map((collection: Collection) => (
                            <CollectionCard
                                key={collection.id}
                                collection={collection}
                                bids={collectionIdAndBidsMap.get(collection.id) || []}
                                onAcceptBid={handleAcceptBid}
                                onRejectBid={handleRejectBid}
                                onDeleteCollection={handleDeleteCollection}
                                onEditCollection={handleEditCollection}
                            />
                        ))}
                    </div>

                    {collections.length > 0 && (
                        <PaginationWrapper
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </main>

            <DeleteConfirmationDialog
                isOpen={deleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                description="Are you sure you want to delete this collection? This action cannot be undone."
            />
        </div>
    );
} 