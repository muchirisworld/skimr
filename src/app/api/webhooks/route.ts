import { createUser, deleteUser } from '@/app/actions/user'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req)

        const eventType = evt.type;
        console.log('Webhook payload:', evt.data);
        
        
        if (eventType === 'user.created') {
            const { id, first_name, last_name, email_addresses, image_url } = evt.data;

            try {
                await createUser({
                    id: id,
                    firstName: first_name ?? '',
                    lastName: last_name ?? '',
                    email: email_addresses[0]?.email_address ?? '',
                    imageUrl: image_url ?? '',
                })

                return new Response('User created', { status: 200 })
            } catch (error) {
                console.error('Error creating user:', error)
                return new Response('Error creating user', { status: 500 })
            }
        }

        if (eventType === "user.deleted") {
            const { id } = evt.data;

            try {
                const resp = await deleteUser(id!);
                console.log(resp)
                return new Response('User created', { status: 200 })
            } catch (error) {
                console.error('Error creating user:', error)
                return new Response('Error creating user', { status: 500 })
            }
        }

        return new Response('Webhook received', { status: 200 })
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error verifying webhook', { status: 400 })
    }
}
