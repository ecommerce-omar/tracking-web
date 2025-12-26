import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tracking, TrackingStatus } from "@/schemas/tracking-schema";

export function useTrackingsRealtime() {
  const [trackings, setTrackings] = useState<Tracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("tracking")
          .select("*")
          .not(
            "current_status",
            "in",
            `(${[
              TrackingStatus.ENTREGUE,
              TrackingStatus.ENTREGUE_REMETENTE,
              TrackingStatus.ENTREGUE_CAIXA_INTELIGENTE,
              TrackingStatus.CANCELADO,
              TrackingStatus.DEVOLVIDO,
            ].join(",")})`
          )
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        setTrackings(data || []);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching trackings:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initial data
    fetchInitialData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("trackings-list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tracking",
        },
        (payload) => {
          console.log("Trackings realtime update:", payload);

          if (payload.eventType === "INSERT") {
            const newTracking = payload.new as Tracking;
            if (newTracking.current_status !== TrackingStatus.ENTREGUE) {
              setTrackings((prev) => [newTracking, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedTracking = payload.new as Tracking;
            setTrackings((prev) => {
              const newTrackings = prev.map((tracking) =>
                tracking.id === updatedTracking.id ? updatedTracking : tracking
              );
              // Remove from list if status changed to delivered
              if (updatedTracking.current_status === TrackingStatus.ENTREGUE) {
                return newTrackings.filter(
                  (tracking) => tracking.id !== updatedTracking.id
                );
              }
              return newTrackings;
            });
          } else if (payload.eventType === "DELETE") {
            const deletedTracking = payload.old as Tracking;
            setTrackings((prev) =>
              prev.filter((tracking) => tracking.id !== deletedTracking.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { trackings, loading, error, refetch: () => setLoading(true) };
}

export function useTrackingByIdRealtime(trackingId: string) {
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!trackingId) return;

    const supabase = createClient();

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("tracking")
          .select("*")
          .eq("id", trackingId)
          .single();

        if (fetchError) throw fetchError;

        setTracking(data);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching tracking:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initial data
    fetchInitialData();

    // Subscribe to realtime changes for this specific tracking
    const channel = supabase
      .channel(`tracking-${trackingId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tracking",
          filter: `id=eq.${trackingId}`,
        },
        (payload) => {
          console.log("Tracking realtime update:", payload);
          const updatedTracking = payload.new as Tracking;
          setTracking(updatedTracking);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trackingId]);

  return { tracking, loading, error, refetch: () => setLoading(true) };
}

export function useTrackingByCodeRealtime(trackingCode: string) {
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!trackingCode || trackingCode.trim().length < 3) {
      setTracking(null);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("tracking")
          .select("*")
          .eq("tracking_code", trackingCode.trim().toUpperCase())
          .maybeSingle();

        if (fetchError) throw fetchError;

        setTracking(data);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching tracking by code:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initial data
    fetchInitialData();

    // Subscribe to realtime changes for this tracking code
    const channel = supabase
      .channel(`tracking-code-${trackingCode}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tracking",
          filter: `tracking_code=eq.${trackingCode.trim().toUpperCase()}`,
        },
        (payload) => {
          console.log("Tracking code realtime update:", payload);

          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            const updatedTracking = payload.new as Tracking;
            setTracking(updatedTracking);
          } else if (payload.eventType === "DELETE") {
            setTracking(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trackingCode]);

  return { tracking, loading, error, refetch: () => setLoading(true) };
}

export async function updateTrackingStatus(
  trackingId: string,
  status: string
): Promise<Tracking> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tracking")
    .update({
      current_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", trackingId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
