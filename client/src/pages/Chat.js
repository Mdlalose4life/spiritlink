import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Heading,
  useToast,
} from '@chakra-ui/react';
import './Chat.css';
import { useChat } from '../ChatContext';
import Sidebar from '../components/Sidebar';
import customAxios from '../axiosUser';

function Chat({ rooms }) {
  const [newMessage, setNewMessage] = useState('');
  const [message, setMessage] = useState([]);
  const toast = useToast();
  const { selectedChat} = useChat();

  const handleSendMessage = async () => {
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { payload } = await customAxios.post('/msgs/send', {
        content: newMessage,
        chatId: selectedChat._id,
      }, config);
      setNewMessage('');
      setMessage([...message, payload]);
      console.log(payload);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Cannot create the messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  const fetchMessages = async () => {
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { payload } = await customAxios.get(`/msgs/allMessages/${selectedChat._id}`, config);
      setMessage(payload);
      console.log(payload)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Cannot fetch the messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      direction="column"
      className="full-height"
    >
      <Flex className="full-height">
        {/* Left Border for Chat Names (1/4) */}
        <Box w="25%" className="border-right" borderRight="1px solid gray">
          <Box className="chat-names">
            <Box className="chat-name-header">
              <Heading as="h4">Find Friends</Heading>
              <i className="bi bi-arrow-right-circle"></i>
            </Box>
            {/* Render the sidebar components */}
            <Sidebar rooms={rooms} />
            {/* { useChat && <Mychats/>} */}
          </Box>
        </Box>

        {/* Right Border for Messages (3/4) */}
        <Box w="75%">
          <Box className="message-box">
            <Text className="messages-label">Messages</Text>
            {/* Messages go here */}

            {/* Form for Typing Messages and Send Button */}
            <form className="message-form" onSubmit={handleSendMessage}>
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="message-input"
              />
              <Button type="submit" colorScheme="blue" className="send-button">
                Send
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Chat;
