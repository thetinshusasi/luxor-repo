"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { FormActions, FormActionButton } from "@/components/ui/FormActions";
import { DollarSign } from "lucide-react";
import Link from "next/link";

interface BidFormProps {
    initialPrice?: number;
    onSubmit: (price: number) => void;
    isSubmitting?: boolean;
    submitText?: string;
    cancelHref?: string;
    collectionName?: string;
    collectionPrice?: number;
}

export function BidForm({
    initialPrice = 0,
    onSubmit,
    isSubmitting = false,
    submitText = "Place Bid",
    cancelHref = "/collections",
    collectionName,
    collectionPrice
}: BidFormProps) {
    const [price, setPrice] = useState<number>(initialPrice);

    useEffect(() => {
        setPrice(initialPrice);
    }, [initialPrice]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (price <= 0) {
            return;
        }

        onSubmit(price);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setPrice(parseFloat(value) || 0);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {collectionName && (
                <div className="text-sm text-gray-600">
                    <p>Collection: {collectionName}</p>
                    {collectionPrice && <p>Current Collection Price: ${collectionPrice}</p>}
                </div>
            )}

            <FormField label="Bid Amount ($)" htmlFor="price" required>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="0"
                        value={price}
                        onChange={handlePriceChange}
                        className="pl-10"
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
                <p className="text-xs text-gray-500">
                    Enter a price higher than the current collection price to make your bid competitive.
                </p>
            </FormField>

            <FormActions>
                <Link href={cancelHref}>
                    <FormActionButton
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </FormActionButton>
                </Link>
                <FormActionButton
                    type="submit"
                    disabled={isSubmitting || !price || isNaN(Number(price))}
                >
                    <DollarSign className="h-4 w-4" />
                    <span>{isSubmitting ? 'Processing...' : submitText}</span>
                </FormActionButton>
            </FormActions>
        </form>
    );
} 