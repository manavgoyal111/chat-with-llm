import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Chat from './components/Chat';
import Models from './components/Models';
import History from './components/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={
          <Layout currentPageName="Chat">
            <Chat />
          </Layout>
        } />
        <Route path="/models" element={
          <Layout currentPageName="Models">
            <Models />
          </Layout>
        } />
        <Route path="/history" element={
          <Layout currentPageName="History">
            <History />
          </Layout>
        } />
        <Route path="/" element={
          <Layout currentPageName="Chat">
            <Chat />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;