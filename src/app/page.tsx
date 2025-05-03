"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { CameraIcon, SparklesIcon, Code2Icon, DatabaseIcon } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen max-w-screen-xl mx-auto flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <CameraIcon className="h-6 w-6" />
            <span className="font-semibold">Skimr</span>
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col items-center justify-center gap-8 py-24 text-center">
          <div className="flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
            <SparklesIcon className="h-4 w-4" />
            <span>Full-Stack Image Management Demo</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            AI-Powered Image Management
            <br />
            <span className="text-primary">Built with Modern Tech</span>
          </h1>
          
          <p className="max-w-[42rem] text-muted-foreground sm:text-xl sm:leading-8">
            A demonstration of a full-stack image management application built with Next.js, 
            featuring AI-powered image recognition, secure file storage, and real-time search capabilities.
          </p>

          <div className="flex gap-4">
            {isSignedIn ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button size="lg">Try the Demo</Button>
              </SignUpButton>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto max-w-6xl px-4 py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Code2Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Modern Stack</h3>
              <p className="text-muted-foreground">
                Built with Next.js 14, TypeScript, Tailwind CSS, and Drizzle ORM
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <SparklesIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI Integration</h3>
              <p className="text-muted-foreground">
                AWS Rekognition for automatic image labeling and tagging
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <DatabaseIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Cloud Infrastructure</h3>
              <p className="text-muted-foreground">
                AWS S3 for storage, Supabase for PostgreSQL, and Vercel for deployment
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="container mx-auto max-w-6xl px-4 py-24">
          <h2 className="text-3xl font-bold text-center mb-12">Technical Highlights</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Frontend</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Next.js 14 with App Router</li>
                <li>• TypeScript for type safety</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Shadcn/ui for components</li>
                <li>• Clerk for authentication</li>
              </ul>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Backend</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Drizzle ORM for database operations</li>
                <li>• AWS S3 for file storage</li>
                <li>• AWS Rekognition for AI features</li>
                <li>• Supabase for PostgreSQL database</li>
                <li>• Server Actions for API endpoints</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
