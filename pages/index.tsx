import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../src/components/Navbar/Navbar';

const IndexPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard');
    }, [router]);

    return (
        <>
            <Navbar />
        </>
    );
};

export default IndexPage;
