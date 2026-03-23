export const runtime = 'edge';

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#113A74' }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Page Not Found</h2>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                The page you are looking for does not exist.
            </p>
            <a
                href="/"
                style={{
                    backgroundColor: '#113A74',
                    color: 'white',
                    padding: '12px 28px',
                    borderRadius: '9999px',
                    textDecoration: 'none',
                    fontWeight: '600'
                }}
            >
                Back to Home
            </a>
        </div>
    );
}
