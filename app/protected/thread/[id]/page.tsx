import { getThread } from './actions'
import ThreadClient from './components/thread-client'

const ThreadPage = async ({ params }: { params: Promise<{ id: string }> }) => {

    const param = await params
    const threadId = param.id

    const { thread, members, replies } = await getThread(threadId);

    return (
        <ThreadClient thread={thread} members={members} replies={replies} />
    )
}

export default ThreadPage