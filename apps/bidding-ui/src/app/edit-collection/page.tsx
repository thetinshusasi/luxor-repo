"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageLayout } from "@/components/layout/PageLayout";
import { FormCard } from "@/components/ui/FormCard";
import { CollectionForm } from "@/components/collections/CollectionForm";
import { useDeleteCollection, useGetCollectionById, useUpdateCollection } from "@/lib/hooks/useApi";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export default function EditCollectionPage() {
  const searchParams = useSearchParams();
  const { mutate: deleteCollection, isPending: isDeleting } = useDeleteCollection();
  const { mutate: updateCollection, isPending: isUpdating } = useUpdateCollection();
  const router = useRouter();
  const { toast } = useToast();
  const id = searchParams.get('id');
  const { data: collection, isLoading, error, refetch: refetchCollection } = useGetCollectionById(id as string);

  const handleSubmit = (formData: { name: string; description: string; price: number; stock: number }) => {
    updateCollection({
      id: id as string,
      data: formData
    }, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Collection updated successfully!",
        });
        router.push('/');
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update collection. Please try again.",
          variant: "destructive",
        });
        console.error('Error updating collection:', error);
      }
    });
  };

  const handleDelete = () => {
    deleteCollection(id as string, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Collection deleted successfully!",
        });
        router.push('/');
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to delete collection. Please try again.",
          variant: "destructive",
        });
        console.error('Error deleting collection:', error);
      }
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Loading collection..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorDisplay
          message={`Error loading collection: ${error.message}`}
          onRetry={() => refetchCollection()}
          retryText="Retry"
        />
      </ProtectedRoute>
    );
  }

  if (!collection) {
    return (
      <ProtectedRoute>
        <ErrorDisplay
          message="Collection not found"
          onRetry={() => router.push('/')}
          retryText="Back to Dashboard"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageLayout
        title="Edit Collection"
        showBackButton
        backHref="/"
        showCreateButton={false}
        showCollectionsButton={false}
      >
        <div className="max-w-4xl mx-auto">
          <FormCard
            title="Edit Collection"
            description="Update the details for your collection"
          >
            <CollectionForm
              initialData={{
                name: collection.name,
                description: collection.description,
                price: Number(collection.price),
                stock: Number(collection.stock),
              }}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              isSubmitting={isUpdating}
              isDeleting={isDeleting}
              submitText="Save Changes"
              cancelHref="/"
              showDeleteButton={true}
            />
          </FormCard>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
} 