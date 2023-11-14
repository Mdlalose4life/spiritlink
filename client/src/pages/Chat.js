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

  useEffect(() => {
    console.log('Selected Chat in useEffect:', selectedChat);
    if (selectedChat && selectedChat.data && selectedChat.data._id) {
      fetchMessages();
    }
  }, [selectedChat]);


  const handleSendMessage = async () => {
    console.log('Selected Chat in handleSendMessage:', selectedChat);
    try {
      if (!selectedChat?.data?._id) {
        console.log('Chat ID is undefined', selectedChat);
        throw new Error('Selected chat or chat ID is undefined');
      }

      console.log('Sending Message to Chat ID', selectedChat.data._id)

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      
      const { data } = await customAxios.post('/msgs/send', {
        content: newMessage,
        chatId: selectedChat.data._id,
      }, config);
      setNewMessage('');
      setMessage((prevMessages) => [...prevMessages, data]);

    } catch (error) {
      console.log('Error in handleSendMessage', error)
      toast({
        title: 'Error',
        description: `Cannot create the messages: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (selectedChat?.data?._id) {
      fetchMessages();
    }
  }, [selectedChat]);

  const fetchMessages = async () => {
    try {
      console.log('Selected Chat fetch msg', selectedChat)
      
      if (!selectedChat || !selectedChat.data || !selectedChat.data._id) {
        throw new Error('Selected chat or chat ID is undefined');
      }

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { payload } = await customAxios.get(`/msgs/allMessages/${selectedChat.data._id}`, config);
      console.log('Messages is', payload)      
      setMessage(payload);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
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
          </Box>
        </Box>

        {/* Right Border for Messages (3/4) */}
        <Box w="75%">
          <Box className="message-box">
            <Text className="messages-label">Messages</Text>
            {/* Messages go here */}
            <form className="message-form" onSubmit={(e) => {
              e.preventDefault();
              console.log('Form submitted', selectedChat);
              handleSendMessage();
              }}>
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
