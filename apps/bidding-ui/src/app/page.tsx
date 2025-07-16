"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Check, X, User, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  useAcceptBid, useRejectBid, useDeleteCollection, Collection,
  BidStatus, useUserDetails, useUserCollections, useAllBidsByCollectionIds, CollectionBid
} from "@/lib/hooks/useApi";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/hooks/useAuth";
import { CollectionBids } from "@/lib/models/interfaces/collectionBids";

export interface UserCollections {
  data: Collection[];
  pageSize: number;
  page: number;
  totalPages: number;
}

export default function DashboardPage() {
  const [expandedCollections, setExpandedCollections] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
  const itemsPerPage = 4;

  // TanStack Query hooks
  // const { data: { data: collectionsData }, isLoading, error } = useCollections(currentPage, itemsPerPage);
  const acceptBidMutation = useAcceptBid();
  const rejectBidMutation = useRejectBid();
  const deleteCollectionMutation = useDeleteCollection();
  const { logout, setUser } = useAuth();
  const { data: userDetails, error: userDetailsError } = useUserDetails();
  const { data: {
    data: userCollectionsData = [],
    pageSize,
    page,
    totalPages,
  } = {}, isLoading: userCollectionsLoading, error: userCollectionsError, refetch: userCollectionsRefetch } = useUserCollections(currentPage, itemsPerPage);

  const { data: allBidsByCollectionIdsData,
    isLoading: allBidsByCollectionIdsLoading, error: allBidsByCollectionIdsError } = useAllBidsByCollectionIds(userCollectionsData.map((collection: Collection) => collection.id));
  console.log(allBidsByCollectionIdsData);
  console.log(allBidsByCollectionIdsLoading);
  console.log(allBidsByCollectionIdsError);

  const collectionIdAndBidsMap = new Map<string, CollectionBid[]>();
  allBidsByCollectionIdsData?.forEach((collectionBidList: CollectionBids) => {
    collectionIdAndBidsMap.set(collectionBidList.collectionId, collectionBidList.bids);
  });


  useEffect(() => {
    if (userDetails) {
      setUser(userDetails);
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

  const handleAcceptBid = (bidId: string) => {
    acceptBidMutation.mutate({ bidId });
  };

  const handleRejectBid = (bidId: string) => {
    rejectBidMutation.mutate({ bidId });
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
    // Navigate to edit page
    window.location.href = `/edit-collection?id=${collectionId}`;
  };

  const handleLogout = () => {
    logout();
  };

  if (userCollectionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collections...</p>
        </div>
      </div>
    );
  }

  if (userCollectionsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading collections: {userCollectionsError.message}</p>
          <Button onClick={handleLogout} className="mt-4">
            Log out and try again
          </Button>
        </div>
      </div>
    );
  }

  const collections = userCollectionsData || [];
  const disableNextButton = currentPage >= totalPages;
  const disablePreviousButton = currentPage <= 1;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900">Simple Bidding App</h1>
              <div className="flex items-center space-x-4">
                <Link href="/collections">
                  <Button variant="outline" size="sm">
                    View other Collections
                  </Button>
                </Link>

                <div className="flex items-center space-x-4">
                  <Link href="/create">
                    <Button className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Create</span>
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarImage src="/avatar.png" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
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
                          {collection.isOwner && (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCollection(collection.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCollection(collection.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          {!collection.isOwner && (
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
                            const bids = collectionIdAndBidsMap.get(collection.id)?.sort((a, b) => b.price - a.price);
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
                          const bids = collectionIdAndBidsMap.get(collection.id);
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
                                            onClick={() => handleAcceptBid(bid.id)}
                                            className="h-6 w-6 p-0"
                                          >
                                            <Check className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRejectBid(bid.id)}
                                            className="h-6 w-6 p-0"
                                          >
                                            <X className="h-3 w-3" />
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
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={disablePreviousButton ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink isActive>{currentPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className={disableNextButton ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this collection? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
