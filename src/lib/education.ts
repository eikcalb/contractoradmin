export interface IEducationHistory {
    type_school?: string
    institute_name?: string
    degree_area?: string
    years_attended?: number
    graduated?: boolean
}


export interface ILicense {
    license_number: string
    date_obtained: Date
    expiration_date: Date
}