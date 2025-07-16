"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormCard } from "@/components/ui/FormCard";
import { CollectionForm } from "@/components/collections/CollectionForm";
import { useCreateCollection } from "@/lib/hooks/useApi";

export default function CreateCollectionPage() {
    const { mutate: createCollection, isPending: isCreating } = useCreateCollection();
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = (formData: { name: string; description: string; price: number; stock: number }) => {
        if (formData.name === "" || formData.description === "" || formData.price === 0 || formData.stock === 0) {
            toast({
                title: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        createCollection(formData, {
            onSuccess: () => {
                router.push('/');
            },
        });
    };

    return (
        <ProtectedRoute>
            <PageLayout
                title="Create Collection"
                showBackButton
                backHref="/"
                showCreateButton={false}
                showCollectionsButton={false}
            >
                <div className="max-w-4xl mx-auto">
                    <FormCard
                        title="Collection Details"
                        description="Fill in the details for your new collection"
                    >
                        <CollectionForm
                            onSubmit={handleSubmit}
                            isSubmitting={isCreating}
                            submitText="Create Collection"
                            cancelHref="/"
                        />
                    </FormCard>
                </div>
            </PageLayout>
        </ProtectedRoute>
    );
} 