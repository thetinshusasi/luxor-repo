"use client";

import { ReactNode } from "react";
import { Header } from "./Header";

interface PageLayoutProps {
    children: ReactNode;
    title?: string;
    showCreateButton?: boolean;
    showCollectionsButton?: boolean;
    onLogout?: () => void;
    showBackButton?: boolean;
    backHref?: string;
    backText?: string;
}

export function PageLayout({
    children,
    title,
    showCreateButton = true,
    showCollectionsButton = true,
    onLogout,
    showBackButton = false,
    backHref,
    backText = "Back"
}: PageLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title={title}
                showCreateButton={showCreateButton}
                showCollectionsButton={showCollectionsButton}
                onLogout={onLogout}
                showBackButton={showBackButton}
                backHref={backHref}
                backText={backText}
            />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {children}
                </div>
            </main>
        </div>
    );
} 