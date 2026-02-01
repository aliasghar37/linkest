import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flext justify-center items-center py-8 ">
            <SignUp
                appearance={{
                    elements: {
                        rootBox: "scale-115",
                    },
                }}
            />
        </div>
    );
}
