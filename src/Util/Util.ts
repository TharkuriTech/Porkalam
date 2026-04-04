export const getIPAddress = async (): Promise<string> => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Failed to get IP address:', error);
        return '';
    }
};

export const test = () => {
    console.log("Test function called");
}