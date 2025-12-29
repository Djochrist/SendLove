import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useVideos() {
  return useQuery({
    queryKey: [api.videos.list.path],
    queryFn: async () => {
      const res = await fetch(api.videos.list.path);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return api.videos.list.responses[200].parse(await res.json());
    },
  });
}

export function useUploadVideo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, title, description }: { file: File; title: string; description: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);

      // Using XMLHttpRequest for upload progress could be added here
      // For now using fetch for simplicity compatible with standard hooks
      const res = await fetch(api.videos.upload.path, {
        method: api.videos.upload.method,
        body: formData,
        // Content-Type header not set manually for FormData to let browser set boundary
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.videos.upload.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to upload video");
      }

      return api.videos.upload.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.videos.list.path] });
      toast({
        title: "Video uploaded successfully",
        description: "Your video is now available in the gallery.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.videos.delete.path, { id });
      const res = await fetch(url, {
        method: api.videos.delete.method,
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Video not found");
        }
        throw new Error("Failed to delete video");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.videos.list.path] });
      toast({
        title: "Video deleted",
        description: "The video has been removed permanently.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
