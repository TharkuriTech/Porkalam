export interface UserData {
  userId: number;
  userName: string;
  fullName: string;
  token: string;
  expiration: string;
  fatherName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  mobileNumber: string;
  constituencyId: number;
  constituency: string;
  stateId: number;
  state: string;
  countryId: number;
  country: string;
  isVerified: boolean;
}

export const setUserData = (userData: UserData): void => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getUserData = (): UserData | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser) as UserData;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }
  return null;
};

export const clearUserData = (): void => {
  localStorage.removeItem('user');
};

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