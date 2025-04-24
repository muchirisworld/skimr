import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex md:flex-col md:items-center md:justify-center bg-muted p-10">
            <div className="max-w-md">
                <h1 className="text-3xl font-bold mb-6">Welcome to Our Platform</h1>
                <p className="text-muted-foreground mb-4">
                    Join thousands of users who are already enjoying our services. Sign up today to get started or sign in to
                    continue your journey.
                </p>
            </div>
        </div>
        <div className="flex items-center justify-center p-6">{children}</div>
    </div>
  )
}

