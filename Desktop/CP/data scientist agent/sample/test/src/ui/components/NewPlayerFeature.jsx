import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography, Snackbar } from '@mui/material';
import { useSnackbar } from 'notistack';

const NewPlayerFeature = () => {
    const [playerName, setPlayerName] = useState('');
    const [playerEmail, setPlayerEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/api/players', {
                name: playerName,
                email: playerEmail,
            });

            if (response.status === 201) {
                enqueueSnackbar('Player added successfully!', { variant: 'success' });
                setPlayerName('');
                setPlayerEmail('');
            }
        } catch (error) {
            enqueueSnackbar('Failed to add player. Please try again.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Add New Player
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Player Name"
                    variant="outlined"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Player Email"
                    variant="outlined"
                    value={playerEmail}
                    onChange={(e) => setPlayerEmail(e.target.value)}
                    margin="normal"
                    required
                    type="email"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? 'Adding...' : 'Add Player'}
                </Button>
            </form>
        </Box>
    );
};

export default NewPlayerFeature;
