import { baseApi } from './baseApi';

export const hospitalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWards: builder.query({
            query: () => '/private/wards',
            providesTags: ['Wards'],
        }),
        getBedTypes: builder.query({
            query: () => '/private/bed-types',
            providesTags: ['BedTypes'],
        }),
        getAllHistory: builder.query({
            query: () => '/private/history',
            providesTags: ['History'],
        }),
        getWardLogs: builder.query({
            query: () => '/private/history/ward-logs',
            providesTags: ['History'],
        }),
        getBedsByWard: builder.query({
            query: (wardId) => `/private/wards/${wardId}/available-beds`,
            providesTags: (result, error, wardId) => [{ type: 'Beds', id: wardId }],
        }),
        getAllBedsByWard: builder.query({
            query: (wardId) => `/private/wards/${wardId}/beds`,
            providesTags: (result, error, wardId) => [{ type: 'Beds', id: wardId }],
        }),
        getPatients: builder.query({
            query: () => '/private/patients',
            providesTags: ['Patients'],
        }),
        getDoctors: builder.query({
            query: () => '/private/doctors',
            providesTags: ['Doctors'],
        }),
        getPriorityTypes: builder.query({
            query: () => '/private/priority-types',
            providesTags: ['PriorityTypes'],
        }),
        createAdmissionRequest: builder.mutation({
            query: (body) => ({
                url: '/private/admission-requests',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Patients', 'History', 'DoctorRequests'],
        }),
        getDoctorAdmissionRequests: builder.query({
            query: () => '/private/admission-requests/doctor',
            providesTags: ['DoctorRequests'],
        }),
        updateAdmissionRequestStatus: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/private/admission-requests/${id}/status`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['DoctorRequests', 'Patients', 'History'],
        }),
        getApprovedAdmissionRequests: builder.query({
            query: () => '/private/admission-requests/approved',
            providesTags: ['ApprovedRequests'],
        }),
        assignBed: builder.mutation({
            query: (body) => ({
                url: '/private/admissions/assign-bed',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['ApprovedRequests', 'Patients', 'History', 'Wards', 'Beds'],
        }),
        getActiveAdmissions: builder.query({
            query: () => '/private/active-admissions',
            providesTags: ['ActiveAdmissions'],
        }),
        transferPatient: builder.mutation({
            query: (body) => ({
                url: '/private/admissions/transfer',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['ActiveAdmissions', 'Patients', 'History', 'Wards', 'Beds'],
        }),
        dischargePatient: builder.mutation({
            query: (body) => ({
                url: '/private/admissions/discharge',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['ActiveAdmissions', 'Patients', 'History', 'Wards', 'Beds'],
        }),
    }),
});

export const {
    useGetWardsQuery,
    useGetBedTypesQuery,
    useGetAllHistoryQuery,
    useGetWardLogsQuery,
    useGetBedsByWardQuery,
    useGetAllBedsByWardQuery,
    useGetPatientsQuery,
    useGetDoctorsQuery,
    useGetPriorityTypesQuery,
    useCreateAdmissionRequestMutation,
    useGetDoctorAdmissionRequestsQuery,
    useUpdateAdmissionRequestStatusMutation,
    useGetApprovedAdmissionRequestsQuery,
    useAssignBedMutation,
    useGetActiveAdmissionsQuery,
    useTransferPatientMutation,
    useDischargePatientMutation,
} = hospitalApi;
