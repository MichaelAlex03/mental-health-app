import { GetConversationsType } from '@/app/schemas/messages'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getConversations } from '../actions'


interface MessagesClientProps {
  conversations: GetConversationsType[]
  nextPage: number | null
}

const MessagesClient = ({ conversations, nextPage }: MessagesClientProps) => {

  const [convoList, setConvoList] = useState<GetConversationsType[]>(conversations);
  const [page, setPage] = useState<number | null>(nextPage);
  const isFetchingRef = useRef(false);
  const sentinalRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || page === null) return;

    isFetchingRef.current = true
    try {
      const { validatedData, nextPage } = await getConversations(page)
      setConvoList((prev) => [...prev, ...validatedData])
      setPage(nextPage)
    } finally {
      isFetchingRef.current = true
    }

  }, [page])

  useEffect(() => {
    if (!sentinalRef.current) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { threshold: 0.1 }
    )
    observer.observe(sentinalRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div>MessagesClient</div>
  )
}

export default MessagesClient