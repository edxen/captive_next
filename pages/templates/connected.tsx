import { useState } from 'react';
import { useRouter } from 'next/router';

import { fetchAPI, getCurrentTranslation } from "../components/utils";
import Layout from "../components/layout";

const texts = getCurrentTranslation();

const Connected = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleClick = async () => {
        const result = confirm('Are you sure?');
        if (result) {
            setIsLoading(true);
            await fetchAPI({ target: 'handler', method: 'POST', body: { action: 'disconnect' } });
            router.push('/');
        }
    };

    return (
        <Layout isLoading={isLoading}>
            <h2>This is connected page</h2>

            <button onClick={handleClick}>{texts.buttons.disconnect}</button>
        </Layout>
    );
};

export default Connected;