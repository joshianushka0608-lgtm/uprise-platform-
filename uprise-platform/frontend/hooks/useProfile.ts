"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "./useAuth";

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  city?: string;
  state?: string;
  student_id?: string;
  student_id_verified: boolean;
  roles: { role_type: string; active: number }[];
  skills: { id: string; skill_name: string; skill_level: string; verified: number }[];
  stats: { tasks_posted: number; tasks_completed: number };
  created_at: string;
}

export function useProfile() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data as { user: ProfileData };
    },
    enabled: !!localStorage.getItem("uprise_token"),
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<ProfileData>) => {
      const res = await api.put("/users/me", updates);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const toggleRoles = useMutation({
    mutationFn: async (roles: { role_type: string; active: boolean }[]) => {
      const res = await api.put("/users/roles", { roles });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const addSkill = useMutation({
    mutationFn: async (skill_name: string) => {
      const res = await api.post("/users/skills", { skill_name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const removeSkill = useMutation({
    mutationFn: async (skillId: string) => {
      await api.delete(`/users/skills/${skillId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const submitStudentId = useMutation({
    mutationFn: async (student_id: string) => {
      const res = await api.put("/users/student-id", { student_id });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    profile: data?.user,
    isLoading,
    error,
    refetch,
    updateProfile,
    toggleRoles,
    addSkill,
    removeSkill,
    submitStudentId,
  };
}
