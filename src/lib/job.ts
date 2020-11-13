import { geoFirestore } from "./firebase";

export interface IJob {
    employer_name: string
    employer_phone_number: string
    employer_address: string
    supervisor_name?: string
    supervisor_title?: string
    user_position_title?: string
    date_started: Date
    date_ended: Date
    actual_job?: boolean
    salary?: string
    wage?: string
    description?: string
}

export interface IJobHistory {
    employer_name: string
    employer_phone_number: string
    employer_address: string
    supervisor_name?: string
    supervisor_title?: string
    user_position_title?: string
    date_started: Date
    date_ended: Date
    actual_job?: boolean
    salary?: string
    wage?: string
    description?: string
}

export class Job {
    private static db = geoFirestore.collection('jobs')

    static async getActiveJobs() {
        Job.db.where('status', '==', 'in progress').native.orderBy('date_created', 'desc').limit(6).get().then(async snap => {
            const jobs: IJob[] = []
            snap.forEach(async doc => {
                jobs.push(doc.data())
            })
        })
    }
}