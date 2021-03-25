import { geoFirestore } from "./firebase";
import firebase from 'firebase'
import { useCallback } from "react";
import { User } from "./user";
import { Application } from ".";

export interface ICard {
    mask: string
    year: number
    month: number
    brand: string
    name: string
}

export interface ITransaction extends ICard {
    id: string
    amount: number
    description: string
}

export class Job {
    static async getTransactions(app: Application, page: 1, limit: 20) {
        const resp = await app.initiateNetworkRequest(`/payments/transactions?page=${page}&limit=${limit}`, undefined, true)
        if (!resp.ok) {
            if (resp.status === 418) {
                throw new Error((await resp.json()).message || 'Failed to fetch transactions')
            } else {
                throw new Error('Failed to fetch transactions')
            }
        }
    }
}