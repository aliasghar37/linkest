import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const event = await verifyWebhook(req);
        // console.log("Webhook payload:", event.data);

        const { id } = event.data;

        if (event.type === "user.created") {
            const { email_addresses, first_name, last_name, image_url } =
                event.data;

            await prisma.user.create({
                data: {
                    clerkId: id as string,
                    email: email_addresses[0].email_address,
                    firstName: first_name as string,
                    lastName: last_name as string,
                    imageUrl: image_url,
                    role: "free",
                },
            });

            console.log("userId:", event.data.id);
            console.log("prisma work done");
        }

        try {
            const client = await clerkClient();
            await client.users.updateUser(id as string, {
                publicMetadata: { role: "free" },
            });
            console.log("clerk work done");
        } catch (error) {
            throw new Error("Failed to set user role");
        }

        return new Response("Webhook received", { status: 200 });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error verifying webhook", { status: 400 });
    }
}

// export async function POST() {
//   return Response.json({ message: 'The route is working' })
// }
