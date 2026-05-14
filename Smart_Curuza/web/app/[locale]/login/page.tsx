import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <LoginForm />
        </div>
    );
}
