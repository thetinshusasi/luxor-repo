"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Check, X, User, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCollections, useAcceptBid, useRejectBid, useDeleteCollection, Collection, Bid, BidStatus, useUserDetails, useUserCollections } from "@/lib/hooks/useApi";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardPage() {
  const [expandedCollections, setExpandedCollections] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // TanStack Query hooks
  const { data: collectionsData, isLoading, error } = useCollections(currentPage, itemsPerPage);
  const acceptBidMutation = useAcceptBid();
  const rejectBidMutation = useRejectBid();
  const deleteCollectionMutation = useDeleteCollection();
  const { logout, setUser } = useAuth();
  const { data: userDetails, isLoading: userDetailsLoading, error: userDetailsError } = useUserDetails();
  const { data: userCollections, isLoading: userCollectionsLoading, error: userCollectionsError } = useUserCollections();
  console.log(userCollections);



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

  const toggleCollection = (collectionId: string) => {
    setExpandedCollections(prev =>
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    if (confirm('Are you sure you want to delete this collection?')) {
      deleteCollectionMutation.mutate(collectionId);
    }
  };

  const handleEditCollection = (collectionId: string) => {
    // Navigate to edit page
    window.location.href = `/edit-collection?id=${collectionId}`;
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading collections: {error.message}</p>
          <Button onClick={handleLogout} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const collections = collectionsData || [];

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
                <Card key={collection.id} className="shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-semibold">
                          {collection.name}
                        </CardTitle>
                        <p className="text-gray-600 mt-2">{collection.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          ${collection.price}
                        </Badge>
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
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Created: {formatDate(collection.createdAt)}</span>
                        <span>Stock: {collection.stock}</span>
                      </div>

                      {collection.bids && collection.bids.length > 0 && (
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between">
                              <span>Bids ({collection.bids.length})</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2">
                            {collection.bids.map((bid: Bid) => (
                              <div
                                key={bid.id}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <span className="font-medium">${bid.price}</span>
                                  <span className="text-sm text-gray-500 ml-2">
                                    by User {bid.userId}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
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
                          </CollapsibleContent>
                        </Collapsible>
                      )}

                      {!collection.isOwner && (
                        <div className="flex justify-between items-center">
                          <Link href={`/place-bid?collectionId=${collection.id}`}>
                            <Button variant="outline" size="sm">
                              Place Bid
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
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
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink isActive>{currentPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className={collections.length < itemsPerPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
