"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronRight, Plus, DollarSign, Calendar, User } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Mock data for collections
const mockCollections = [
    {
        id: 1,
        title: "Vintage Art Collection",
        description: "A stunning collection of vintage artwork from the 19th century",
        startingPrice: 2500,
        currentHighestBid: 3200,
        endDate: "2024-12-31",
        totalBids: 8,
        status: "active",
        bids: [
            { id: 1, amount: 3200, bidder: "John Doe", date: "2024-12-15", status: "highest" },
            { id: 2, amount: 3100, bidder: "Jane Smith", date: "2024-12-14", status: "active" },
            { id: 3, amount: 3000, bidder: "Mike Johnson", date: "2024-12-13", status: "active" },
        ]
    },
    {
        id: 2,
        title: "Antique Furniture Set",
        description: "Beautiful antique furniture from the Victorian era",
        startingPrice: 1500,
        currentHighestBid: 2100,
        endDate: "2024-12-25",
        totalBids: 5,
        status: "active",
        bids: [
            { id: 4, amount: 2100, bidder: "Alice Brown", date: "2024-12-15", status: "highest" },
            { id: 5, amount: 2000, bidder: "Bob Wilson", date: "2024-12-14", status: "active" },
        ]
    },
    {
        id: 3,
        title: "Rare Coin Collection",
        description: "Extremely rare coins from ancient civilizations",
        startingPrice: 5000,
        currentHighestBid: 7500,
        endDate: "2024-12-20",
        totalBids: 12,
        status: "active",
        bids: [
            { id: 6, amount: 7500, bidder: "Sarah Davis", date: "2024-12-15", status: "highest" },
            { id: 7, amount: 7200, bidder: "Tom Miller", date: "2024-12-14", status: "active" },
            { id: 8, amount: 7000, bidder: "Lisa Garcia", date: "2024-12-13", status: "active" },
        ]
    },
    {
        id: 4,
        title: "Classic Car Collection",
        description: "Vintage automobiles from the 1950s and 1960s",
        startingPrice: 10000,
        currentHighestBid: 12500,
        endDate: "2024-12-28",
        totalBids: 15,
        status: "active",
        bids: [
            { id: 9, amount: 12500, bidder: "David Lee", date: "2024-12-15", status: "highest" },
            { id: 10, amount: 12000, bidder: "Emma Taylor", date: "2024-12-14", status: "active" },
        ]
    },
    {
        id: 5,
        title: "Jewelry Collection",
        description: "Exquisite jewelry pieces from renowned designers",
        startingPrice: 3000,
        currentHighestBid: 4500,
        endDate: "2024-12-22",
        totalBids: 6,
        status: "active",
        bids: [
            { id: 11, amount: 4500, bidder: "Rachel Green", date: "2024-12-15", status: "highest" },
            { id: 12, amount: 4200, bidder: "Chris Anderson", date: "2024-12-14", status: "active" },
        ]
    }
];

export default function CollectionsPage() {
    const [expandedCollections, setExpandedCollections] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const toggleCollection = (collectionId: number) => {
        setExpandedCollections(prev =>
            prev.includes(collectionId)
                ? prev.filter(id => id !== collectionId)
                : [...prev, collectionId]
        );
    };

    const totalPages = Math.ceil(mockCollections.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCollections = mockCollections.slice(startIndex, endIndex);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'highest': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
                            <Link href="/create">
                                <Button className="flex items-center space-x-2">
                                    <Plus className="h-4 w-4" />
                                    <span>Create Collection</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {currentCollections.map((collection) => (
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
                                                    <CardTitle className="text-xl">{collection.title}</CardTitle>
                                                    <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">Current Bid</p>
                                                    <p className="text-lg font-semibold text-green-600">
                                                        ${collection.currentHighestBid.toLocaleString()}
                                                    </p>
                                                </div>
                                                <Link href={`/place-bid?collection=${collection.id}`}>
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Place Bid
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span>Starting: ${collection.startingPrice.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Ends: {formatDate(collection.endDate)}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <User className="h-4 w-4" />
                                                    <span>{collection.totalBids} bids</span>
                                                </div>
                                            </div>
                                            <Badge className={getStatusColor(collection.status)}>
                                                {collection.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CollapsibleContent>
                                        <CardContent className="pt-0">
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold mb-3">Recent Bids</h4>
                                                <div className="space-y-3">
                                                    {collection.bids.map((bid) => (
                                                        <div key={bid.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex items-center space-x-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={`/api/avatar/${bid.bidder}`} />
                                                                    <AvatarFallback>
                                                                        {bid.bidder.substring(0, 2).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium text-sm">{bid.bidder}</p>
                                                                    <p className="text-xs text-gray-500">{formatDate(bid.date)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-3">
                                                                <span className="font-semibold text-lg">
                                                                    ${bid.amount.toLocaleString()}
                                                                </span>
                                                                <Badge className={getStatusColor(bid.status)}>
                                                                    {bid.status}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(page)}
                                                isActive={currentPage === page}
                                                className="cursor-pointer"
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
} 