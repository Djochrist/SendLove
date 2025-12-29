import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type CreateVideoRequest, type VideoRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// POST /api/requests
export function useCreateRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateVideoRequest) => {
      const res = await fetch(api.requests.create.path, {
        method: api.requests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.requests.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Impossible de créer la demande.");
      }
      return api.requests.create.responses[201].parse(await res.json());
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.requests.get.path, data.id], data);
    },
  });
}

// GET /api/requests/:id
export function useRequest(id: string) {
  return useQuery({
    queryKey: [api.requests.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.requests.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Erreur de chargement");
      
      return api.requests.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// GET /api/requests/:id/status (Polling)
export function useRequestStatus(id: string) {
  return useQuery({
    queryKey: [api.requests.status.path, id],
    queryFn: async () => {
      const url = buildUrl(api.requests.status.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (!res.ok) throw new Error("Erreur de statut");
      
      return api.requests.status.responses[200].parse(await res.json());
    },
    enabled: !!id,
    refetchInterval: (query) => {
      // Poll every 1s if status is pending or processing
      const status = query.state.data?.status;
      return status === "completed" || status === "failed" ? false : 1000;
    },
  });
}
