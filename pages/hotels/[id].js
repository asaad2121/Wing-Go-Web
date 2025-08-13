import { useRouter } from 'next/router';

export default function HotelPage() {
    const router = useRouter();
    const { id } = router.query;
    console.log(id);

    return <h1>Hotel ID: {id}</h1>;
}
