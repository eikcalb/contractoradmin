import { Application } from ".";

export const TRANSACTION_STATUS = {
    PENDING: 0,
    SUCCESS: 1,
    FAILED: 2,
    DECLINED: 3,
    UNCAPTURED: 4
}

export interface ICard {
    mask: string
    year: number
    month: number
    brand: string
    name: string
}

export interface IPayment {
    status: 'pending' | 'paid'
    timestamp
    cost: number
    title
    payee
    id: string
}

export interface IInvoice {
    invoiceReference: string
    description?: string
    jobTitle?: string
    jobStatus?: string
    location?: string
    amount: string
    fees: string
    total: string
    deployee?: string
    paymentMethod: string
    invoiceURL: string
    transactionStatus: string
    transactionID: string
    user: String
    dateCreated: Date
}

export interface ITransaction extends ICard {
    id: string
    amount: number
    description: string
}

const CurrencyFormatter = Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency', maximumFractionDigits: 2 })
export const PAYMENT_PAGE_LIMIT = 30
export const INVOICE_PAGE_LIMIT = 30

export class Payment {
    static async getTransactions(app: Application, page = 1, limit = PAYMENT_PAGE_LIMIT): Promise<IPayment[]> {
        const resp = await app.initiateNetworkRequest(`/payments/transactions?page=${page}&limit=${limit}`, undefined, true)
        if (!resp.ok) {
            if (resp.status === 418) {
                throw new Error((await resp.json()).message || 'Failed to fetch transactions')
            } else {
                throw new Error('Failed to fetch transactions')
            }
        }

        return (await resp.json()).map(({ id, dateCreated: timestamp, amount: cost, user: payee, title, status }): IPayment => ({
            id,
            timestamp,
            cost,
            title,
            payee,
            status: status === TRANSACTION_STATUS.SUCCESS ? 'paid' : 'pending'
        }))
    }

    static async getInvoices(app: Application, page = 1, limit = PAYMENT_PAGE_LIMIT): Promise<IInvoice[]> {
        const resp = await app.initiateNetworkRequest(`/payments/invoices?page=${page}&limit=${limit}`, undefined, true)
        if (!resp.ok) {
            if (resp.status === 418) {
                throw new Error((await resp.json()).message || 'Failed to fetch transactions')
            } else {
                throw new Error('Failed to fetch transactions')
            }
        }

        const result = (await resp.json())
        return result.invoices
    }

    static getPaymentDescription(payment: IPayment): string {
        switch (payment.status) {
            case 'pending':
                return `Pending charge of ${CurrencyFormatter.format(payment.cost)} for the completion of this job by ${payment.payee}`
            case 'paid':
                return `A payment of ${CurrencyFormatter.format(payment.cost)} has been submitted to ${payment.payee}`
        }
    }
}