interface FetchAPI {
    target: string;
    method: string;
    headers?: { [key: string]: string; };
    body?: { [key: string]: string; };
}

const fetchAPI = async ({ target, method, headers, body }: FetchAPI) => {

    const bodyString = JSON.stringify(body);

    try {
        const response = await fetch(`../api/${target}`, { method, headers, body: bodyString });
        if (response.ok) return await response.json();
        else throw new Error('Error fetching data');
    } catch (error) {
        console.error(`There was an error: ${error}`);
    }
};

export default fetchAPI;