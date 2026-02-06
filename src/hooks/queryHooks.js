import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { analyticsService } from "../services/analyticsService";
import { bookingService } from "../services/bookingService";

export const queryKeys = {
  dashboard: ["dashboard"],
  sports: ["sports"],
  courts: (sport) => ["courts", sport],
  masterSchedule: (dateKey) => ["masterSchedule", dateKey],
  myReservations: (userId) => ["myReservations", userId],
  reservation: (id) => ["reservation", id],
};

export function useDashboardData() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => analyticsService.getDashboardData(),
  });
}

export function useSports() {
  return useQuery({
    queryKey: queryKeys.sports,
    queryFn: () => bookingService.getSports(),
  });
}

export function useCourts(sport) {
  return useQuery({
    queryKey: queryKeys.courts(sport),
    queryFn: () => bookingService.getCourts(sport),
    enabled: Boolean(sport),
  });
}

export function useMasterScheduleData(date) {
  const dateKey =
    date instanceof Date
      ? date.toISOString().split("T")[0]
      : String(date || "");

  return useQuery({
    queryKey: queryKeys.masterSchedule(dateKey),
    queryFn: () => bookingService.getMasterScheduleData(date),
    enabled: Boolean(date),
  });
}

export function useMyReservations(userId) {
  return useQuery({
    queryKey: queryKeys.myReservations(userId),
    queryFn: () => bookingService.getMyReservations(userId),
    enabled: Boolean(userId),
  });
}

export function useReservationDetail(id) {
  return useQuery({
    queryKey: queryKeys.reservation(id),
    queryFn: () => bookingService.getReservationById(id),
    enabled: Boolean(id),
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => bookingService.cancelReservation(id),
    onSuccess: (_data, variables) => {
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.reservation(variables.id),
        });
      }
      if (variables?.userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.myReservations(variables.userId),
        });
      }
    },
  });
}
