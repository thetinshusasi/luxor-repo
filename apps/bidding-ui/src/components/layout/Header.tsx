"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
    title?: string;
    onLogout?: () => void;
    showCreateButton?: boolean;
    showCollectionsButton?: boolean;
    showBackButton?: boolean;
    backHref?: string;
    backText?: string;
}

export function Header({ 
    title = "Simple Bidding App",
    onLogout, 
    showCreateButton = true, 
    showCollectionsButton = true,
    showBackButton = false,
    backHref,
    backText = "Back"
}: HeaderProps) {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        {showBackButton && backHref && (
                            <Link href={backHref}>
                                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>{backText}</span>
                                </Button>
                            </Link>
                        )}
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        {showCollectionsButton && (
                            <Link href="/collections">
                                <Button variant="outline" size="sm">
                                    View other Collections
                                </Button>
                            </Link>
                        )}

                        <div className="flex items-center space-x-4">
                            {showCreateButton && (
                                <Link href="/create">
                                    <Button className="flex items-center space-x-2">
                                        <Plus className="h-4 w-4" />
                                        <span>Create Collection</span>
                                    </Button>
                                </Link>
                            )}

                            {onLogout && (
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
                                        <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
} 