import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Payment {
    cvv: string;
    expiryDate: string;
    fullName: string;
    email: string;
    address: string;
    amount: bigint;
    cardNumber: string;
}
export interface backendInterface {
    getAllPayments(): Promise<Array<Payment>>;
    submitPayment(fullName: string, address: string, email: string, cardNumber: string, expiryDate: string, cvv: string, amount: bigint): Promise<void>;
}
