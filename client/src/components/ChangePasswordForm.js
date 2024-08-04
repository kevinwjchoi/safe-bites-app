import React, { useState } from 'react';
import { Typography, Grid, TextField, Button } from '@mui/material';

const ChangePasswordForm = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = () => {
        // Add your password change logic here
        onClose();
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>Change Password</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">Current Password:</Typography>
                    <TextField
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">New Password:</Typography>
                    <TextField
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Confirm Password:</Typography>
                    <TextField
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={handleChangePassword} sx={{ mt: 2 }}>
                Change Password
            </Button>
        </>
    );
};

export default ChangePasswordForm;
