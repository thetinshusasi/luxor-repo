"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/FormField";
import { FormActions, FormActionButton } from "@/components/ui/FormActions";
import { Save, Trash2 } from "lucide-react";
import Link from "next/link";

interface CollectionData {
    name: string;
    description: string;
    price: number;
    stock: number;
}

interface CollectionFormProps {
    initialData?: CollectionData;
    onSubmit: (data: CollectionData) => void;
    onDelete?: () => void;
    isSubmitting?: boolean;
    isDeleting?: boolean;
    submitText?: string;
    cancelHref?: string;
    showDeleteButton?: boolean;
}

export function CollectionForm({
    initialData,
    onSubmit,
    onDelete,
    isSubmitting = false,
    isDeleting = false,
    submitText = "Save Changes",
    cancelHref = "/",
    showDeleteButton = false
}: CollectionFormProps) {
    const [formData, setFormData] = useState<CollectionData>({
        name: "",
        description: "",
        price: 0,
        stock: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                price: Number(initialData.price),
                stock: Number(initialData.stock),
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.name === "" || formData.description === "" || formData.price === 0 || formData.stock === 0) {
            // This validation should be handled by the parent component
            return;
        }

        onSubmit(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? 0 : Number(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Title" htmlFor="name" required>
                <Input
                    id="name"
                    name="name"
                    placeholder="Enter collection title"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
            </FormField>

            <FormField label="Description" htmlFor="description" required>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter collection description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                />
            </FormField>

            <FormField label="Starting Price ($)" htmlFor="price" required>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                />
            </FormField>

            <FormField label="Stock" htmlFor="stock" required>
                <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                />
            </FormField>

            <FormActions className="flex justify-between items-center">
                {showDeleteButton && onDelete && (
                    <FormActionButton
                        type="button"
                        variant="destructive"
                        onClick={onDelete}
                        disabled={isDeleting}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Collection</span>
                    </FormActionButton>
                )}

                <div className="flex space-x-4">
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
                        disabled={isSubmitting}
                    >
                        <Save className="h-4 w-4" />
                        <span>{submitText}</span>
                    </FormActionButton>
                </div>
            </FormActions>
        </form>
    );
} 