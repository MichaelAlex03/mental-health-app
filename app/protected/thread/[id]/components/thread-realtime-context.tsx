'use client'

import { ThreadReplies, ThreadReply } from '@/app/schemas/thread-replies'
import { createContext, useCallback, useContext, useEffect, useRef } from 'react'

export type RealtimeEvent = { type: 'INSERT'; reply: ThreadReply }
    | { type: 'UPDATE'; reply: ThreadReplies }

type Callback = (event: RealtimeEvent) => void

interface RealtimeContextValue {
    subscribe: (cb: Callback) => () => void
    publish: (event: RealtimeEvent) => void
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const subscribersRef = useRef(new Set<Callback>())

    const subscribe = useCallback((cb: Callback) => {
        subscribersRef.current.add(cb)
        return () => { subscribersRef.current.delete(cb) }
    }, [])

    const publish = useCallback((event: RealtimeEvent) => {
        subscribersRef.current.forEach(cb => cb(event))
    }, [])

    return (
        <RealtimeContext.Provider value={{ subscribe, publish }}>
            {children}
        </RealtimeContext.Provider>
    )
}

export function useRealtimePublish() {
    const ctx = useContext(RealtimeContext);
    if (!ctx) throw new Error('useRealtimePublish must be used within RealtimeProvider')
    return ctx.publish
}

export function useRealtimeSubscription(callback: Callback) {
    const ctx = useContext(RealtimeContext)
    if (!ctx) throw new Error('useRealtimeSubscription must be used within RealtimeProvider')
    const callbackRef = useRef(callback)
    callbackRef.current = callback

    useEffect(() => {
        return ctx.subscribe((event) => callbackRef.current(event))
    }, [ctx])
}