import React from 'react'
import {HStack, Avatar, Text} from "@chakra-ui/react"

const Message = ({ user = "other", text, uri }) => {
  return (
    <HStack alignSelf={user === "me"?"flex-end" : "flex-start"} borderRadius={"base"} bg={"gray.100"} paddingX={3} paddingY={1.5}>
        {
            user === "other" && <Avatar src={uri}/>
        }
        <Text>{text}</Text>
        {
            user === "me" && <Avatar src={uri} />
        }
    </HStack>
  )
}

export default Message
