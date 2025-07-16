"use client";

import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
    message: string;
    onRetry?: () => void;
    retryText?: string;
}

export function ErrorDisplay({ message, onRetry, retryText = "Try again" }: ErrorDisplayProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-600">{message}</p>
                {onRetry && (
                    <Button onClick={onRetry} className="mt-4">
                        {retryText}
                    </Button>
                )}
            </div>
        </div>
    );
} 