import Layout from "../components/layout";
import { useRouter } from 'next/router';

const Connected = () => {
    const router = useRouter();

    const handleClick = () => {
        const result = confirm('Are you sure?');
        if (result) {
            router.push('/');
        }
    };

    return (
        <Layout>
            <h2>This is connected page</h2>

            <button onClick={handleClick}>Disconnect</button>
        </Layout>
    );
};

export default Connected;