import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from 'react'

export interface ThreadMember {
  avatar_url: string | null
  display_name: string
}

interface MembersProps {
  members: ThreadMember[]
}

const Members = ({ members }: MembersProps) => {


  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={'outline'} size={'sm'}>
          View Members
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thread Members</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {members.map((member, i) => (
            <div key={i} className="flex flex-row gap-2 mb-2">
              <Avatar size="sm" key={i}>
                {member.avatar_url && <AvatarImage src={member.avatar_url} />}
                <AvatarFallback>
                  {member.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="text-sm">{member.display_name}</span>
            </div>
          ))}
        </div>


      </DialogContent>
    </Dialog>
  )
}

export default Members