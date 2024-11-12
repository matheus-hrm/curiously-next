import { auth } from "@/lib/auth"

export default async function UserPage() {

    const session = await auth() 

    return (
        <>
        </>
    )
}