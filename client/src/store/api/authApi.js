import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/public/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation } = authApi;
