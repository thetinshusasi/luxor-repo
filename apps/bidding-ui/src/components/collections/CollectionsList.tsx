"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ChevronDown, ChevronRight, Plus, User, Check, X, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Collection, CollectionBid, BidStatus } from "@/lib/hooks/useApi";

interface CollectionsListProps {
    collections: Collection[];
    bidsMap: Map<string, CollectionBid[]>;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onAcceptBid: (bidId: string, collectionId: string) => void;
    onRejectBid: (bidId: string, collectionId: string) => void;
    onDeleteBid: (bidId: string) => void;
    onEditCollection?: (collectionId: string) => void;
    onDeleteCollection?: (collectionId: string) => void;
    showEditButtons?: boolean;
    showDeleteButtons?: boolean;
    showPlaceBidButton?: boolean;
}

export function CollectionsList({
    collections,
    bidsMap,
    currentPage,
    totalPages,
    onPageChange,
    onAcceptBid,
    onRejectBid,
    onDeleteBid,
    onEditCollection,
    onDeleteCollection,
    showEditButtons = false,
    showDeleteButtons = false,
    showPlaceBidButton = true
}: CollectionsListProps) {
    const [expandedCollections, setExpandedCollections] = useState<string[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bidToDelete, setBidToDelete] = useState<string | null>(null);

    const toggleCollection = (collectionId: string) => {
        setExpandedCollections(prev =>
            prev.includes(collectionId)
                ? prev.filter(id => id !== collectionId)
                : [...prev, collectionId]
        );
    };

    const getStatusColor = (status: BidStatus) => {
        switch (status) {
            case BidStatus.ACCEPTED: return 'bg-green-100 text-green-800';
            case BidStatus.REJECTED: return 'bg-red-100 text-red-800';
            case BidStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDeleteBid = (bidId: string) => {
        setBidToDelete(bidId);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteBid = () => {
        if (bidToDelete) {
            onDeleteBid(bidToDelete);
            setDeleteDialogOpen(false);
            setBidToDelete(null);
        }
    };

    const cancelDeleteBid = () => {
        setDeleteDialogOpen(false);
        setBidToDelete(null);
    };

    const disableNextButton = currentPage >= totalPages;
    const disablePreviousButton = currentPage <= 1;

    return (
        <>
            <div className="grid grid-cols-1 gap-6">
                {collections.map((collection: Collection) => (
                    <Collapsible
                        key={collection.id}
                        open={expandedCollections.includes(collection.id)}
                        onOpenChange={() => toggleCollection(collection.id)}
                    >
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm" className="p-0 h-auto">
                                                {expandedCollections.includes(collection.id) ? (
                                                    <ChevronDown className="h-5 w-5" />
                                                ) : (
                                                    <ChevronRight className="h-5 w-5" />
                                                )}
                                            </Button>
                                        </CollapsibleTrigger>
                                        <div>
                                            <CardTitle className="text-xl">{collection.name}</CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Price</p>
                                            <p className="text-lg font-semibold text-green-600">
                                                ${collection.price}
                                            </p>
                                        </div>
                                        {showEditButtons && onEditCollection && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onEditCollection(collection.id)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {showDeleteButtons && onDeleteCollection && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onDeleteCollection(collection.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {showPlaceBidButton && !collection.isOwner && (
                                            <Link href={`/place-bid?collectionId=${collection.id}`}>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Place Bid
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <span>Stock: {collection.stock}</span>
                                        </div>
                                        {(() => {
                                            const bids = bidsMap.get(collection.id)?.sort((a, b) => b.price - a.price);
                                            return bids && bids.length > 0 ? (
                                                <div className="flex items-center space-x-1">
                                                    <User className="h-4 w-4" />
                                                    <span>{bids.length} bids</span>
                                                </div>
                                            ) : null;
                                        })()}
                                    </div>
                                    <Badge variant="outline">
                                        ${collection.price}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CollapsibleContent>
                                <CardContent className="pt-0">
                                    {(() => {
                                        const bids = bidsMap.get(collection.id);
                                        return bids && bids.length > 0 ? (
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold mb-3">Bids</h4>
                                                <div className="space-y-3">
                                                    {bids.map((bid: CollectionBid) => (
                                                        <div
                                                            key={bid.id}
                                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div>
                                                                    <p className="font-medium text-sm">Bid #{bid.id.substring(0, 8)}</p>
                                                                    <p className="text-xs text-gray-500">Bid placed</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-3">
                                                                <span className="font-semibold text-lg">
                                                                    ${bid.price}
                                                                </span>
                                                                <Badge className={getStatusColor(bid.status)}>
                                                                    {bid.status}
                                                                </Badge>
                                                                {collection.isOwner && bid.status === BidStatus.PENDING && (
                                                                    <div className="flex space-x-1">
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() => onAcceptBid(bid.id, collection.id)}
                                                                            className="h-6 w-6 p-0"
                                                                        >
                                                                            <Check className="h-3 w-3" />
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => onRejectBid(bid.id, collection.id)}
                                                                            className="h-6 w-6 p-0"
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                                {bid.isOwner && bid.status === BidStatus.PENDING && (
                                                                    <div className="flex space-x-1">
                                                                        <Link href={`/edit-bid?bidId=${bid.id}&collectionId=${collection.id}&price=${bid.price}`}>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="h-6 w-6 p-0"
                                                                            >
                                                                                <Edit className="h-3 w-3" />
                                                                            </Button>
                                                                        </Link>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => handleDeleteBid(bid.id)}
                                                                            className="h-6 w-6 p-0"
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border-t pt-4">
                                                <p className="text-gray-500 text-center py-4">No bids yet</p>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>
                ))}
            </div>

            {/* Pagination */}
            {collections.length > 0 && (
                <div className="mt-6 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                                    className={disablePreviousButton ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink isActive>{currentPage}</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => onPageChange(currentPage + 1)}
                                    className={disableNextButton ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* Delete Bid Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Bid</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this bid? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelDeleteBid}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteBid}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
} 