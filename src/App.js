import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChatPage from './Components/ChatPage';
import HomePage from './Components/HomePage';
import { UserProvider } from './Context/UserProvider';
import { SocketProvider } from './Context/SocketProvider';


const App = () => {
  return (
    <SocketProvider>
      <UserProvider>
        <div className="App">
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/chatpage" exact element={<ChatPage />} />
          </Routes>
        </div>
      </UserProvider>
    </SocketProvider>
  );
};

export default App;