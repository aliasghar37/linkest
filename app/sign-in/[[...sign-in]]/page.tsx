import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex justify-center items-center py-8 mt-32">
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "scale-115",
                    },
                }}
            />
        </div>
    );
}
