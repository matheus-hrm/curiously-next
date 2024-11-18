import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';
import { UserX, ArrowLeft } from 'lucide-react';

export default function UserNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md backdrop-blur-lg bg-white/80 border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
            <UserX className="h-10 w-10 text-red-500" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            User Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            We couldn&apos;t find the user you&apos;re looking for. They may
            have deleted their account or the URL might be incorrect.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/search">Search Users</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
