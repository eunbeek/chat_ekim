import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Tooltip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MessagesPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const userId = parseInt(query.get('id'));
  const email = query.get('email');
  const name = query.get('name');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const websocket = useRef(null); 

  useEffect(() => {
    fetch(`${process.env.REACT_APP_REST_API_URL}/api/messages`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error('Failed to fetch messages:', error));
  }, []);

  useEffect(() => {
    websocket.current = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_API_URL}`);
    
    websocket.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.current.onmessage = (event) => {
        if (event.data instanceof Blob) {
          event.data.text().then((text) => {
            try {
              const newMsg = JSON.parse(text);
              handleReceivedMessage(newMsg);   
            } catch (error) {
              console.error('Failed to parse JSON:', error);
            }
          });
        } else {
          try {
            const newMsg = JSON.parse(event.data);
            handleReceivedMessage(newMsg);  
          } catch (error) {
            console.error('Failed to parse JSON:', error);
          }
        }
      };
      
      const handleReceivedMessage = (newMsg) => {
        console.log(newMsg);
        if (newMsg.action === 'delete') {
          setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== newMsg.messageId));
        } else {
          setMessages((prevMessages) => [...prevMessages, newMsg]);
        }
      };      

    websocket.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = { message: newMessage, user_id: userId, email, name };
   
      fetch(`${process.env.REACT_APP_REST_API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })
        .then((response) => response.json())
        .then((res) => {
          const {id} = res.data;

          websocket.current.send(JSON.stringify({ id: id, message: newMessage, user_id: userId, email, name }));
          setNewMessage('');
        })
        .catch((error) => console.error('Failed to send message:', error));
    }
  };
 
  const handleDeleteMessage = (messageId) => {

    if(messageId){
        fetch(`${process.env.REACT_APP_REST_API_URL}/api/message?id=${messageId}`, {
            method: 'DELETE',
          })
            .then((response) => response.json())
            .then((data) => {
              const deleteMessage = {
                action: 'delete',
                messageId: messageId,
              };
              websocket.current.send(JSON.stringify(deleteMessage));
            })
            .catch((error) => {
              console.error('Failed to delete message from DB:', error);
            });
    }
  };  
  
  return (
    <Container maxWidth="md" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box
        sx={{
            flexGrow: 1,
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9',
        }}
        >
        {messages.length === 0 ? (
            <Typography>No messages yet.</Typography>
        ) : (
            messages.map((msg, index) => (
            <Box
                key={index}
                sx={{
                display: 'flex',
                justifyContent: msg.user_id === userId ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
                }}
            >
                {msg.user_id !== userId && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                    sx={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#ccc',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '20px',
                        color: '#fff',
                        marginRight: '10px',
                    }}
                    >
                        <Tooltip title={msg.name}>
                            {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                        </Tooltip>
                    </Box>
                    <Typography
                    sx={{
                        backgroundColor: '#fff',
                        padding: '10px',
                        borderRadius: '10px',
                        maxWidth: '60%',
                        wordWrap: 'break-word',
                    }}
                    >
                    {msg.message}
                    </Typography>
                </Box>
                )}

                {msg.user_id === userId && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                    sx={{
                        backgroundColor: '#e3f2fd',
                        padding: '10px',
                        borderRadius: '10px',
                        maxWidth: '60%',
                        wordWrap: 'break-word',
                    }}
                    >
                    {msg.message}
                    </Typography>
                    <IconButton
                        onClick={() => handleDeleteMessage(msg.id)} 
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box
                    sx={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#007bff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '20px',
                        color: '#fff',
                        marginLeft: '10px',
                    }}
                    >
                        <Tooltip title={msg.name}>
                            {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                        </Tooltip>
                    </Box>
                </Box>
                )}
            </Box>
            ))
        )}
      </Box>


      <form onSubmit={handleSendMessage} style={{ display: 'flex', marginTop: '20px' }}>
        <TextField
          label="Type a message"
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px' }}>
          Send
        </Button>
      </form>
    </Container>
  );
};

export default MessagesPage;
