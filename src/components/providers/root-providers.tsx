import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./convex-client-provider";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </ClerkProvider>
  );
}
