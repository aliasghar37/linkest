import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
    const authObj = await auth();
    const user = await currentUser();

    return <h1>Dashboard Page</h1>;
}
