import { geoFirestore } from "./firebase";
import firebase from 'firebase'
import { useCallback } from "react";
import { User } from "./user";
import { Application } from ".";


export const JOB_MILE_RADIUS = 10

export interface IJob {
    id
    coordinates: firebase.firestore.GeoPoint
    date_completed: firebase.firestore.Timestamp | null
    date_created: firebase.firestore.Timestamp
    g: any
    executed_by: string
    job_title: string
    job_description: string
    job_type: string
    location: {
        coords: {
            accuracy: number
            altitude: number
            altitudeAccuracy: number
            heading: number
            latitude: number
            longitude: number
            speed: number
        }
        timestamp
    }
    location_address: any
    posted_by: string
    salary: number
    star_rate: number | null
    status: "available" | "in review" | "accepted" | "in progress" | "complete"
    tasks: { id: string, text: string }[]
    wage: "hr"
    required_count: number
    progress?: number
    user?: User
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
    private static types = geoFirestore.collection('types')

    static async getJobTypes(app: Application) {
        return Job.types.doc('jobs').get().then(async snap => {
            let types
            if (snap.exists) {
                types = snap.data()!.types
            }
            return Promise.resolve(types || [])
        })
    }

    static async addJobType(app: Application, type: string) {
        type = type.toLowerCase()
        return Job.types.doc('jobs').update({
            types: firebase.firestore.FieldValue.arrayUnion(type)
        })
    }

    static async addNewJob(app: Application, job, photos: File[] = []) {
        if (!job.posted_by || !job.job_title || !job.salary || !job.wage || (!job.location && !job.location_address)) {
            throw new Error('Complete all required fields to continue!')
        }
        if (job.tasks.length < 1) {
            throw new Error('You must add at least 1 task for this job!')
        }
        if (job.job_title.length < 8 || job.job_description.length < 20) {
            throw new Error("Kindly enter a more meaningful title and description!")
        }
        if (job.required_count < 1) {
            throw new Error("Provide the number of people you require for this job!")
        }
        if (job.salary < 0) {
            throw new Error("Salary must be more than $0!")
        }

        job.coordinates = new firebase.firestore.GeoPoint(job.location.coords.latitude, job.location.coords.longitude)

        const newDoc = Job.db.doc()
        let photo_files

        if (photos && photos.length > 0) {
            // If photo is selected, add the photo
            const body = new FormData()
            photos.map((photo) => {
                body.append("photo", photo);
            })
            const apiResponse = await app.initiateNetworkRequest(`/job/upload`, {
                method: "POST",
                headers: {
                    "x-job-id": newDoc.id,
                },
                body,
            }, true, false)

            if (!apiResponse.ok) {
                throw new Error((await apiResponse.json()).message || "Failed to upload job");
            }

            photo_files = (await apiResponse.json()).data;
        }

        job.id = newDoc.id
        return newDoc.set({ ...job, photo_files })
    }

    static async cancelJob(ctx: Application, job: IJob) {
        if (job.status === 'complete') {
            throw new Error('You cannot cancel a completed job!')
        }

        if (job.status === 'accepted') {
            await ctx.initiateNetworkRequest(`users/cancelJob`, {
                method: 'DELETE',
                body: JSON.stringify({ jobID: job.id, role: ctx.user?.role })
            }, true)
        } else {
            await Job.db.doc(job.id).delete()
        }
        return true
    }

    static async getInactiveJobs(limit = 20) {
        return Job.db.where('status', '==', "complete").native.orderBy('date_created', 'desc').limit(limit).get().then(async snap => {
            const jobs: IJob[] = []
            snap.forEach(doc => {
                const item: any = doc.data()
                item.id = doc.id
                if (item.location?.address) {
                    item.location_address = item.location.address
                }
                jobs.push(item)
            })
            return Promise.resolve(jobs)
        })
    }

    static async getActiveJobs(limit = 20) {
        return Job.db.where('status', 'in', ["available", "in review", "accepted", "in progress"]).native.orderBy('date_created', 'desc').limit(limit).get().then(async snap => {
            const jobs: IJob[] = []
            snap.forEach(async doc => {
                const item: any = doc.data()
                item.id = doc.id
                if (item.location?.address) {
                    item.location_address = item.location.address
                }
                jobs.push(item)
            })
            return Promise.resolve(jobs)
        })
    }

    static listenForActiveAndPendingJobs(callback, limit = 100) {
        const unsubscribe = Job.db.where('status', 'in', ["available", "in review", "accepted", "in progress"]).limit(limit).onSnapshot(async snap => {
            const jobs: IJob[] = [];
            (snap.native as firebase.firestore.QuerySnapshot).forEach(doc => {
                const item: any = doc.data()
                item.id = doc.id
                if (item.location?.address) {
                    item.location_address = item.location.address
                }
                jobs.push(item)
            })
            callback(null, jobs)
        }, err => callback(err, null))

        return unsubscribe
    }

    static listenForActiveJobs(callback, limit = 9) {
        const unsubscribe = Job.db.where('status', 'in', ["in review", "accepted", "in progress"]).limit(limit).onSnapshot(async snap => {
            const jobs: IJob[] = [];
            (snap.native as firebase.firestore.QuerySnapshot).forEach(doc => {
                const item: any = doc.data()
                item.id = doc.id
                if (item.location?.address) {
                    item.location_address = item.location.address
                }
                jobs.push(item)
            })
            callback(null, jobs)
        }, err => callback(err, null))

        return unsubscribe
    }

    static listenForActiveJobsWithChangeHandler({ added, modified, removed }: {
        added: (data: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>) => any,
        modified: (data: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>) => any,
        removed: (data: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>) => any
    }) {
        const unsubscribe = Job.db.where('status', 'in', ["available", "in review", "accepted", "in progress"]).limit(6).onSnapshot(async snap => {
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

    static getPhotoURL(app: Application, id) {
        return `${app.config.hostname}/images/${id}.jpg`
    }
}