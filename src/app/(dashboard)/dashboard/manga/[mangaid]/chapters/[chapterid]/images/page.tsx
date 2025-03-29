"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAppDispatch } from "@/lib/redux/hook";

export default function ChapterImagesPage() {
  const params = useParams();
  const mangaId = params.mangaId as string;
  const chapterId = params.chapterId as string;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Make chapter data stateful so we can update it
  const [chapter, setChapter] = useState({
    chapterNumber: 1,
    title: "Mock Chapter Title",
    images: [
      {
        id: "1",
        url: "https://laodongnhatban.com.vn/images/2018/12/28/7acd1f89-c39e-4381-a33e-3da33b39c6ac.jpg",
        pageNumber: 1,
      },
      {
        id: "2",
        url: "https://toquoc.mediacdn.vn/280518851207290880/2023/10/29/photo-1698382908617-1698382908759950746948-1698560683705-1698560683879344298607.png",
        pageNumber: 2,
      },
      {
        id: "3",
        url: "https://cdn2.tuoitre.vn/zoom/700_700/471584752817336320/2024/11/2/1-17304432133401727596968-0-0-628-1200-crop-1730517845910432434004.jpg",
        pageNumber: 3,
      },
    ],
  });
  const isChapterLoading = false;
  const chapterError = null;

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Append all files to form data
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      // Simulate progress (in a real app, you'd use an upload progress event)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle image deletion
  const confirmDeleteImage = (imageId: string) => {
    setImageToDelete(imageId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      // Filter out the deleted image
      const updatedImages = chapter.images.filter(img => img.id !== imageToDelete);
      
      // Update page numbers
      const renumberedImages = updatedImages.map((image, index) => ({
        ...image,
        pageNumber: index + 1,
      }));
      
      // Update chapter state
      setChapter({
        ...chapter,
        images: renumberedImages
      });

      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
      setHasChanges(true);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Handle drag and drop reordering - FIXED
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    
    // Return if dropped outside the list or at the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Create a copy of the images array
    const items = Array.from(chapter.images);
    
    // Remove the dragged item
    const [reorderedItem] = items.splice(source.index, 1);
    
    // Insert it at the destination
    items.splice(destination.index, 0, reorderedItem);

    // Update page numbers based on new order
    const updatedItems = items.map((item, index) => ({
      ...item,
      pageNumber: index + 1,
    }));

    // Update chapter state with the new order
    setChapter({
      ...chapter,
      images: updatedItems
    });
    
    // Mark that we have unsaved changes
    setHasChanges(true);
  };

  // Save reordered images
  const saveImageOrder = async () => {
    try {
      const imageOrder = chapter.images.map((image, index) => ({
        id: image.id,
        pageNumber: index + 1,
      }));

      console.log("Saving new image order:", imageOrder);
      
      // Simulate API call to save order
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would update your backend here

      setHasChanges(false);
    } catch (error) {
      console.error("Error saving image order:", error);
    }
  };

  if (isChapterLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (chapterError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/manga/${mangaId}/chapters`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>Failed to load chapter details. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/manga/${mangaId}/chapters/${chapterId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Chapter Images
            </h1>
            <p className="text-muted-foreground">
              Chapter {chapter?.chapterNumber}: {chapter?.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button onClick={saveImageOrder}>
              <Save className="mr-2 h-4 w-4" />
              Save Order
            </Button>
          )}
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Images
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {isUploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Uploading images...</p>
                <p className="text-sm text-muted-foreground">
                  {uploadProgress}%
                </p>
              </div>
              <Progress value={uploadProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Chapter Images</CardTitle>
          <CardDescription>
            {chapter?.images.length === 0
              ? "No images uploaded yet. Click 'Upload Images' to add images to this chapter."
              : `${chapter?.images.length} images. Drag and drop to reorder.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chapter?.images.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No images uploaded yet
                </p>
              </div>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="chapter-images" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                  >
                    {chapter?.images.map((image, index) => (
                      <Draggable
                        key={image.id}
                        draggableId={image.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="group relative aspect-[2/3] overflow-hidden rounded-md border"
                          >
                            <div className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white">
                              {index + 1}
                            </div>
                            <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => confirmDeleteImage(image.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Image
                              src={image.url || "/placeholder.svg"}
                              alt={`Page ${image.pageNumber}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {chapter?.images.length}{" "}
            {chapter?.images.length === 1 ? "image" : "images"}
          </p>
          {chapter?.images.length > 0 && (
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/manga/${mangaId}/chapters/${chapterId}`)
              }
            >
              View Chapter
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteImage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
