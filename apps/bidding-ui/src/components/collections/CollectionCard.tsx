"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Edit, Trash2, User, ChevronDown, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { Collection, CollectionBid } from "@/lib/hooks/useApi";
import { BidItem } from "@/components/bids/BidItem";

interface CollectionCardProps {
    collection: Collection;
    bids: CollectionBid[];
    onAcceptBid: (bidId: string, collectionId: string) => void;
    onRejectBid: (bidId: string, collectionId: string) => void;
    onDeleteCollection: (collectionId: string) => void;
    onEditCollection: (collectionId: string) => void;
}

export function CollectionCard({
    collection,
    bids,
    onAcceptBid,
    onRejectBid,
    onDeleteCollection,
    onEditCollection,
}: CollectionCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    

    const sortedBids = bids?.sort((a, b) => b.price - a.price) || [];

    return (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-0 h-auto">
                                    {isExpanded ? (
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
                                        onClick={() => onEditCollection(collection.id)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDeleteCollection(collection.id)}
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
                            {sortedBids.length > 0 && (
                                <div className="flex items-center space-x-1">
                                    <User className="h-4 w-4" />
                                    <span>{sortedBids.length} bids</span>
                                </div>
                            )}
                        </div>
                        <Badge variant="outline">
                            ${collection.price}
                        </Badge>
                    </div>
                </CardHeader>

                <CollapsibleContent>
                    <CardContent className="pt-0">
                        {sortedBids.length > 0 ? (
                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3">Bids</h4>
                                <div className="space-y-3">
                                    {sortedBids.map((bid: CollectionBid) => (
                                        <BidItem
                                            key={bid.id}
                                            bid={bid}
                                            isOwner={collection.isOwner}
                                            onAcceptBid={onAcceptBid}
                                            onRejectBid={onRejectBid}
                                            collectionId={collection.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="border-t pt-4">
                                <p className="text-gray-500 text-center py-4">No bids yet</p>
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
} 