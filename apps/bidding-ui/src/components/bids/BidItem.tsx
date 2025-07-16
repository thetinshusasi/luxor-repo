"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { CollectionBid, BidStatus } from "@/lib/hooks/useApi";

interface BidItemProps {
    bid: CollectionBid;
    isOwner: boolean;
    onAcceptBid: (bidId: string, collectionId: string) => void;
    onRejectBid: (bidId: string, collectionId: string) => void;
    collectionId: string;
}

export function BidItem({ bid, isOwner, onAcceptBid, onRejectBid, collectionId }: BidItemProps) {
    const getStatusColor = (status: BidStatus) => {
        switch (status) {
            case BidStatus.ACCEPTED: return 'bg-green-100 text-green-800';
            case BidStatus.REJECTED: return 'bg-red-100 text-red-800';
            case BidStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                {isOwner && bid.status === BidStatus.PENDING && (
                    <div className="flex space-x-1">
                        <Button
                            size="sm"
                            onClick={() => onAcceptBid(bid.id, collectionId)}
                            className="h-6 w-6 p-0"
                        >
                            <Check className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRejectBid(bid.id, collectionId)}
                            className="h-6 w-6 p-0"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
} 