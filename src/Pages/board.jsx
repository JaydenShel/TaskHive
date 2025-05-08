import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Style/s_board.css';
import { API_BASE_URL } from '../config';

const BoardPage = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [boardData, setBoardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/getBoard`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ boardId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setBoardData(data);
                } else {
                    setBoardData(null);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load board data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBoard();
    }, [boardId]);

    if (loading) return <div className="board-page"><p>Loading...</p></div>;
    if (error) return <div className="board-page"><p>{error}</p></div>;

    return (
        <div className="board-page">
            <h1 className="board-title">
                {boardData ? boardData.name : 'Empty Board'}
            </h1>
            <div className="board-content">
                {boardData ? (
                    <p>Board content goes here.</p>
                ) : (
                    <p>This board is currently empty.</p>
                )}
            </div>
        </div>
    );
};

export default BoardPage;
