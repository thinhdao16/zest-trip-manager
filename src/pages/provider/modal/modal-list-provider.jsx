import * as React from 'react';
import FileDownload from 'react-file-download';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';

import { DataContext } from 'src/store/datacontext/DataContext';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    boxShadow: 210,
    borderRadius: 2,

};
// eslint-disable-next-line react/prop-types
export default function ModalListProvider({ openModal, setOpenModal, idProvider }) {

    const { setLoadingAccProvider } = React.useContext(DataContext)

    const handleCloseCancel = () => setOpenModal(false);
    const handleCloseUpdate = (field) => {
        console.log(field)
        axiosInstance
            .put(`${BASE_URL}/staff/provider-management/providers/${idProvider}`, {
                status: field
            })
            .then((response) => {
                console.log(response)
                setDataProvider(response.data.data);
                // setLoading(false);
                setOpenModal(false)
                setLoadingAccProvider((prev) => !prev)
            })
            .catch((error) => {
                console.error('Error:', error);
                // setLoading(false);
            });
    };

    const [dataProvider, setDataProvider] = React.useState()
    // const [loading, setLoading] = React.useState(false)
    React.useEffect(() => {
        // setLoading(true);
        axiosInstance
            .get(`${BASE_URL}/staff/provider-management/providers/${idProvider}`, {
            })
            .then((response) => {
                setDataProvider(response.data.data);
                // setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                // setLoading(false);
            });
    }, [idProvider]);
    return (
        <div>
            {/* <Backdrop
                // eslint-disable-next-line no-shadow
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                onClick={() => setLoading(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop> */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openModal}>
                    <Box sx={style}>
                        <div className="relative">
                            <div
                                className="absolute top-0 bg-white w-full p-4 shadow-custom-59 rounded-t-xl "
                                style={{ marginTop: "-1px" }}
                            >
                                <div className="flex items-center justify-center">
                                    <span className=" text-2xl font-bold">Company Information</span>
                                </div>
                            </div>
                            <div
                                className="absolute top-5 right-5"
                                style={{ marginTop: "-1px" }}
                            >
                                <button type='button'>
                                    <AiOutlineCloseCircle className='w-7 h-7 text-gray-500' onClick={handleCloseCancel} />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="flex flex-col gap-5 min-h-[20vh] max-h-[80vh] overflow-auto global-scrollbar pt-16 pb-56 p-4">
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-4 justify-start flex">
                                            <span className='font-semibold'>Supply partner ID
                                            </span>
                                        </div>
                                        <div className="col-span-8 flex flex-col">
                                            <span className=''>{dataProvider?.id}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-4 justify-start flex">
                                            <span className='font-semibold'>Company contact</span>
                                        </div>
                                        <div className="col-span-8 flex flex-col">
                                            <span>{dataProvider?.company_name}</span>
                                            <div className="flex gap-1">
                                                <span>{dataProvider?.address_name}</span>
                                                <span>{dataProvider?.address_ward}</span>
                                                <span>{dataProvider?.address_district}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <span>{dataProvider?.address_province},</span>
                                                <span>{dataProvider?.address_country},</span>
                                                <span>{dataProvider?.tax_code}</span>
                                            </div>
                                            <span>{dataProvider?.address_country},</span>
                                            <span>Phone: {dataProvider?.phone}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-4 justify-start flex">
                                            <span className='font-semibold'>Legal status
                                            </span>
                                        </div>
                                        <div className="col-span-8 flex flex-col">
                                            <span className='text-blue-900'>{dataProvider?.status}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-4 justify-start flex">
                                            <span className='font-semibold'>Service type
                                            </span>
                                        </div>
                                        <div className="col-span-8 flex flex-col">
                                            <span>{dataProvider?.service_type}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-4 justify-start flex">
                                            <span className='font-semibold'>Legal company name
                                            </span>
                                        </div>
                                        <div className="col-span-8 flex flex-col">
                                            <span>{dataProvider?.company_name}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-4 justify-start flex">
                                            <span className='font-semibold'>Email company name
                                            </span>
                                        </div>
                                        <div className="col-span-8 flex flex-col">
                                            <span>{dataProvider?.email}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-4 justify-start flex">
                                            <span className='font-semibold'>Managing director
                                            </span>
                                        </div>
                                        <div className="col-span-8 flex flex-col">
                                            <span>{dataProvider?.company_name}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-4 justify-start flex">
                                            <span className='font-semibold'>Company description
                                            </span>
                                        </div>
                                        <div className="col-span-8 flex flex-col">
                                            <span>{dataProvider?.description}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-4 justify-start flex">
                                            <span className='font-semibold'>Company registration number
                                            </span>
                                        </div>
                                        <div className="col-span-8 flex flex-col">
                                            <a
                                                className='text-blue-500'
                                                href={dataProvider?.business_license}
                                            // onClick={() => FileDownload(dataProvider?.business_license, ` registration`)}
                                            >
                                                Download File
                                            </a>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-4 justify-start flex">
                                            <span className='font-semibold'>Company logo
                                            </span>
                                        </div>
                                        <div className="col-span-8 flex flex-col w-96">
                                            <div className='p-1 flex relative'>
                                                <img src={dataProvider?.banner_image_url || "https://i.pinimg.com/736x/fa/60/51/fa6051d72b821cb48a8cc71d3481dfef.jpg"} className='top-0 absolute w-96 h-28 object-cover rounded-2xl' alt="wait" />
                                                <div className="top-16 left-3 absolute bg-white p-1 rounded-full ">
                                                    <img src={dataProvider?.avatar_image_url || "https://i.pinimg.com/736x/fa/60/51/fa6051d72b821cb48a8cc71d3481dfef.jpg"} className=' rounded-full object-cover w-20 h-20' alt="wait" />
                                                </div>
                                                <div className="absolute top-32 right-10 flex gap-3">
                                                    <a
                                                        className='text-blue-500'
                                                        href={dataProvider?.avatar_image_url}
                                                    // onClick={() => FileDownload(dataProvider?.avatar_image_url, `${dataProvider?.avatar_image_url}`)}
                                                    >
                                                        View avatar
                                                    </a>
                                                    <a
                                                        className='text-blue-900'
                                                        href="#"
                                                        onClick={() => FileDownload(dataProvider?.banner_image_url, `${dataProvider?.banner_image_url}`)}
                                                    >
                                                        View banner
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex gap-5 absolute bottom-0 bg-white w-full justify-center p-4 rounded-b-xl border border-solid border-gray-200"
                                style={{ marginBottom: "-1px    " }}
                            >
                                <button
                                    className="px-6 py-2 bg-gray-300 rounded-lg text-gray-600 font-medium"
                                    type='button'
                                    onClick={() => handleCloseUpdate("REJECT")}
                                >
                                    Reject
                                </button>
                                <button
                                    className="px-6 py-2 bg-blue-600 rounded-lg text-white font-medium"
                                    type='button'

                                    onClick={() => handleCloseUpdate("ACCEPTED")}
                                >
                                    Accepted
                                </button>
                            </div>
                        </div>

                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}