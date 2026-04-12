export interface IUserData {
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
export interface ILookup {
  lookupId: number;
  lookupTypeId: number;
  parentLookupId: number;
  value: string;
  shortValue: string;
  isActive: boolean;
  isDeleted: boolean;
}
export interface ICandidate {
    candidateId: number;
    name: string;
    description: string;
    image: string;
    isIndependent: boolean;
    partyName: string;
    partyShortName: string;
    partyLogo: string;
    symbol: string;
    constituency: string;
}

export const setUserData = (userData: IUserData): void => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getUserData = (): IUserData | null => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser) as IUserData;
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