import AppAppBar from "@/components/AppAppBar";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Roboto } from "next/font/google";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

export default async function ({
    children,
    analytics,
    links,
    addLink,
}: {
    children: React.ReactNode;
    analytics: React.ReactNode;
    links: React.ReactNode;
    addLink: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <SignIn routing="hash" />
            </div>
        );
    }

    return (
        <>
            <div className="relative min-h-screen w-full bg-no-repeat dark:bg-[radial-gradient(ellipse_80%_100%_at_50%_-50%,hsl(210,100%,26%),transparent)]">
                <AppAppBar />
                <div className={`w-full flex justify-center pt-52 `}>
                    <div className="grid grid-cols-1 md:grid-cols-2 max-md:grid-cols-1 max-md:grid-rows-4  gap-4  w-10/12 max-w-6xl h-fit">
                        <div className="order-1"> {addLink}</div>
                        <div className="order-2">{analytics}</div>
                        <div className=" order-3 md:col-span-2 flex justify-center">
                            {links}
                        </div>
                    </div>
                </div>

                {children}
            </div>
        </>
    );
}
