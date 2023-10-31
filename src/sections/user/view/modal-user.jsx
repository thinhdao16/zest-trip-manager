import React, { useState } from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";

import { LoadingButton } from '@mui/lab';
import { Box, Modal, Backdrop, TextField, CircularProgress } from '@mui/material';

import * as axiosInstance from 'src/store/apiInterceptors';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    borderRadius: "12px"
};
function ModalUser(openModal) {
    const handleClose = () => openModal?.setOpenModal(false);

    const [email, setEmail] = useState("")
    console.log(email)
    const [firstName, setFirstName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [lastName, setLastName] = useState('')
    const [openLoading, setOpenLoading] = useState(false);

    const handleCreateStaff = (e) => {
        e.preventDefault();
        setOpenLoading(true);
        axiosInstance.axiosInstance
            .post(`${axiosInstance.BASE_URL}/admin/create-staff`, {
                email,
                firstName,
                middleName,
                lastName,
            },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            .then((response) => {
                // Log the response data here
                setOpenLoading(false)
                console.log('Response Data:', response.data);
                setOpenLoading(false);

                // You can add further handling of the response data here
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error:', error);
                setOpenLoading(false);

            });
    };

    return (
        <>
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
            <Backdrop
                // eslint-disable-next-line no-shadow
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
                open={openLoading}
                onClick={() => setOpenLoading(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Modal
                open={openModal?.openModal}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="flex flex-col gap-7 relative p-10">
                        <button type='button' className='absolute top-3 right-3 flex flex-col items-center ' onClick={handleClose}>
                            <AiOutlineCloseCircle className='w-8 h-8' />
                            esc
                        </button>
                        <div className="flex flex-col">
                            <span className='font-semibold text-lg'>Create account for staff</span>
                            <span className='font-normal text-gray-500 text-sm'>Account staff for management user </span>
                        </div>
                        <div className="flex flex-col gap-5">
                            <TextField fullWidth name="email" label="Email address" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                            <TextField fullWidth name="firstName" label="First Name " defaultValue={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            <TextField fullWidth name="middleName" label="Middle Name " defaultValue={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                            <TextField fullWidth name="lastName" label="Last Name " defaultValue={lastName} onChange={(e) => setLastName(e.target.value)} />
                            <TextField
                                id="outlined-read-only-input"
                                label="PassWord"
                                defaultValue="123"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                        </div>
                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="inherit"
                            onClick={handleCreateStaff}
                        >
                            Create
                        </LoadingButton>
                    </div>


                </Box>
            </Modal>
        </>
    )
}


export default ModalUser
