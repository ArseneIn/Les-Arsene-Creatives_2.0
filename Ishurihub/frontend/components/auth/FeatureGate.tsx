"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface FeatureGateProps {
  children: ReactNode;
  feature: string;
  fallback?: ReactNode;
  invert?: boolean; // If true, hide if feature exists
}

/**
 * FeatureGate component to conditionally render UI elements based on school's active features.
 * Priority: Super Admin always sees everything.
 */
export default function FeatureGate({ children, feature, fallback = null, invert = false }: FeatureGateProps) {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Super Admin bypass
  if (user.roleId === 'super_admin') {
    return <>{children}</>;
  }

  const hasFeature = user.school?.features?.includes(feature) || false;
  
  const show = invert ? !hasFeature : hasFeature;

  if (show) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
