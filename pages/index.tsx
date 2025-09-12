import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../src/components/Navbar/NavBar';

const IndexPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard');
    }, [router]);

    return (
        <>
            <NavBar />
        </>
    );
};

export default IndexPage;
