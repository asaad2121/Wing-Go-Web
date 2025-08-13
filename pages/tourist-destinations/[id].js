import { useRouter } from 'next/router';

export default function TouristDestinationPage() {
    const router = useRouter();
    const { id } = router.query;
    console.log(id);

    return <h1>Tourist Destination ID: {id}</h1>;
}
