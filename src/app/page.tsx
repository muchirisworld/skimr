"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { CameraIcon, SparklesIcon } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen flex flex-col">
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
        <div className="container flex flex-col items-center justify-center gap-8 py-24 text-center">
          <div className="flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
            <SparklesIcon className="h-4 w-4" />
            <span>AI-Powered Image Management</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Organize and Discover Your Images
            <br />
            <span className="text-primary">with AI</span>
          </h1>
          
          <p className="max-w-[42rem] text-muted-foreground sm:text-xl sm:leading-8">
            Skimr uses advanced AI to automatically tag and organize your images. 
            Upload your photos and let our AI analyze them to create a smart, searchable collection.
          </p>

          <div className="flex gap-4">
            {isSignedIn ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button size="lg">Get Started</Button>
              </SignUpButton>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="container py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <CameraIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Smart Upload</h3>
              <p className="text-muted-foreground">
                Upload your images and let our AI automatically analyze and tag them
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <SparklesIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI-Powered Search</h3>
              <p className="text-muted-foreground">
                Find your images instantly using natural language search
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  <path d="M18 14h-8" />
                  <path d="M15 18h-5" />
                  <path d="M10 6h8v4h-8V6Z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Organize</h3>
              <p className="text-muted-foreground">
                Create collections and organize your images with ease
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
