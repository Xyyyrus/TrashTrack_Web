const BASE_URL = 'https://us-central1-trashtrack-ac6eb.cloudfunctions.net';

export const fetchNonce = async () => {
    try {
        const response = await fetch(`${BASE_URL}/generateNonce`);
        if (!response.ok) throw new Error('Failed to fetch nonce');
        const { nonce } = await response.json();
        return nonce;
    } catch (error) {
        console.error('Error fetching nonce:', error);
        throw error;
    }
};
