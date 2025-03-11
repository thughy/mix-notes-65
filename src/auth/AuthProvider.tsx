
import { ClerkProvider } from "@clerk/clerk-react";
import { ReactNode } from "react";

// We use the publishable key
const PUBLISHABLE_KEY = "pk_test_YWRhcHRlZC1wZWxpY2FuLTEwLmNsZXJrLmFjY291bnRzLmRldiQ";

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk publishable key");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
