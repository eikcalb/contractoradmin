import { geoFirestore } from "./firebase";
import firebase from 'firebase'
import { useCallback } from "react";

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

    static listenForActiveJobs(callback) {
        const unsubscribe = Job.db.where('status', '==', 'available').limit(6).onSnapshot(async snap => {
            const jobs: IJob[] = [];
            (snap.native as firebase.firestore.QuerySnapshot).forEach(doc => {
                jobs.push(doc.data() as any)
            })
            callback(null, jobs)
        }, err => callback(err, null))

        return unsubscribe
    }

    static listenForActiveJobsWithChangeHandler({ added, modified, removed }) {
        const unsubscribe = Job.db.where('status', '==', 'available').limit(6).onSnapshot(async snap => {
            (snap.native as firebase.firestore.QuerySnapshot).docChanges().forEach(change => {
                switch (change.type) {
                    case 'added':
                        added(change.doc)
                        break
                    case 'modified':
                        modified(change.doc)
                        break
                    case 'removed':
                        removed(change.doc)
                        break
                }
            })
        })

        return unsubscribe
    }
}