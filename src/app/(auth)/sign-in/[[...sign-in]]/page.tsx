import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <SignIn
            appearance={{
                elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none",
                }
            }}
        />
    )
}