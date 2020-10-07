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