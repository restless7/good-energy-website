// lib/useSeatCounter.ts

import { useState, useCallback } from 'react';
import useSWR from 'swr';

interface SeatData {
  totalSeats: number;
  reservedSeats: number;
  remainingSeats: number;
  isFull: boolean;
}

interface SeatResponse {
  success: boolean;
  data?: SeatData;
  error?: string;
}

const fetcher = async (url: string): Promise<SeatResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch seat data');
  }
  return res.json();
};

export function useSeatCounter() {
  const [optimisticSeats, setOptimisticSeats] = useState<number | null>(null);
  
  const { data, error, isLoading, mutate } = useSWR<SeatResponse>(
    '/api/conference/reserve',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      fallbackData: {
        success: true,
        data: {
          totalSeats: 15,
          reservedSeats: 0,
          remainingSeats: 15,
          isFull: false
        }
      }
    }
  );

  const remainingSeats = optimisticSeats ?? data?.data?.remainingSeats ?? 15;
  const isFull = remainingSeats <= 0 || (data?.data?.isFull ?? false);
  const reservedSeats = data?.data?.reservedSeats ?? 0;
  const totalSeats = data?.data?.totalSeats ?? 15;

  const updateOptimisticSeats = useCallback((newCount: number) => {
    setOptimisticSeats(newCount);
    // Reset optimistic update after 5 seconds to sync with real data
    setTimeout(() => {
      setOptimisticSeats(null);
      mutate();
    }, 5000);
  }, [mutate]);

  const refreshSeats = useCallback(() => {
    setOptimisticSeats(null);
    return mutate();
  }, [mutate]);

  return {
    remainingSeats,
    reservedSeats,
    totalSeats,
    isFull,
    isLoading,
    error: error?.message,
    updateOptimisticSeats,
    refreshSeats,
  };
}