import { IWallet } from "./wallet";

export interface IUser {
  id?: string;
  name: string;
  mobNumber: string;
  email: string;
  admin?: boolean;
  password?: string;
  address?: {
    id: number;
    addLine1: string;
  };
  uploadPhoto?: string;
  wallet?: IWallet;
}
