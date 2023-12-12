import { FiEdit } from 'react-icons/fi';
import { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies

import { message } from 'antd';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { formatNumber } from 'src/utils/formatNumber';

import LoadingFullScreen from 'src/loading/LoadingFullScreen';
import { DataContext } from 'src/store/datacontext/DataContext';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';



// ----------------------------------------------------------------------



export default function ListProvider() {
    const { loadingAccProvider, promotion, setPromotion, commision, setCommision, banner, setBanner } = useContext(DataContext);


    const [loading, setLoading] = useState(false);

    const [editPromotion, setEditPromotion] = useState(promotion)
    const [openEditPromotion, setOpenEditPromotion] = useState(true)

    const [editCommission, setEditCommission] = useState(commision)
    const [openEditCommission, setOpenEditCommission] = useState(true)

    const [openEditBanner, setOpenEditBanner] = useState(true)
    const [reloadBanner, setReloadBanner] = useState(null)
    const [fileList, setFileList] = useState([]);

    const formatNumberWithCommas = (value) => {
        const numericValue = value.toString().replace(/[^0-9]/g, "");

        if (numericValue.length >= 3) {
            return new Intl.NumberFormat("en-US").format(Number(numericValue));
            // Use 'en-US' or your preferred locale as an argument
        }

        return numericValue;
    };
    const handleOpenEditPromotion = () => {
        setOpenEditPromotion(false);
    }
    const handleOpenEditCommission = () => {
        setOpenEditCommission(false);
    }
    const handleOpenEditBanner = () => {
        setOpenEditBanner(false);
    }
    const handleCloseEditPromotion = () => {
        setLoading(true)
        console.log(editPromotion)
        axiosInstance.patch(`${BASE_URL}/global/boost-price`,
            {
                price: parseInt(editPromotion, 10)
            }).then((response) => {
                console.log(response)
                message.success("Edit promotion successfully")

                setLoading(false);
                setOpenEditPromotion(true);
            }).catch(
                (error) => {
                    console.log(error)
                    setLoading(false);
                    message?.error(error?.response?.data?.message)
                    setOpenEditPromotion(true);
                }
            )
    }

    const handleCloseEditCommisstion = () => {
        setLoading(true)
        axiosInstance.patch(`${BASE_URL}/global/commission-rate`,
            {
                commission: parseInt(editCommission, 10) / 100
            }).then((response) => {
                console.log(response)
                message.success("Edit commission successfully")
                setLoading(false);
                setOpenEditCommission(true);
            }).catch(
                (error) => {
                    console.log(error)
                    message?.error(error?.response?.data?.message)
                    setLoading(false);
                    setOpenEditCommission(true);
                }
            )
    }

    console.log(parseInt(editCommission, 10) / 100)
    const handleUploadAll = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('file', file);
            });

            const response = await axiosInstance.patch(`${BASE_URL}/global/banner`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success(response.data.message);
            console.log(response);
            setReloadBanner((prev) => !prev)

        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setLoading(false);
            setOpenEditBanner(true);
            setReloadBanner((prev) => !prev)
        }
    };


    const handleFileInputChange = (event) => {
        const { files } = event.target;
        setFileList(Array.from(files));
    };


    useEffect(() => {
        axiosInstance
            .get(`${BASE_URL}/global/boost-price`,)
            .then((response) => {
                setPromotion(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setLoading(false);
            });
        axiosInstance
            .get(`${BASE_URL}/global/commission-rate`,)
            .then((response) => {
                setCommision(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setLoading(false);
            });
        axiosInstance
            .get(`${BASE_URL}/global/banner`,)
            .then((response) => {
                setBanner(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setLoading(false);
            });
        setEditPromotion(promotion)
        setEditCommission(commision)
    }, [commision, loadingAccProvider, promotion, setBanner, setCommision, setPromotion, loading, reloadBanner]);

    return (
        <>
            {loading ? (
                <LoadingFullScreen loading={loading} />
            ) : (
                <Container>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4">Global</Typography>
                    </Stack>
                    <div className='grid grid-cols-3 gap-10 mb-8'>
                        <div className='rounded-lg bg-white shadow-custom-card-mui h-52'>
                            <div className='p-4 flex justify-between'>
                                <span className='font-medium text-xl'>
                                    Promotion
                                </span>
                                {openEditPromotion ? (
                                    <button type='button' onClick={handleOpenEditPromotion} className=' bg-blue-600 text-white px-4 rounded-md flex  items-center gap-1'>
                                        <FiEdit />
                                        Edit
                                    </button>
                                ) : (
                                    <button type='button' onClick={handleCloseEditPromotion} className=' bg-yellow-600 text-white px-4 rounded-md flex  items-center gap-1'>
                                        <FiEdit />
                                        Save
                                    </button>
                                )}

                            </div>
                            <hr />
                            <div className='p-4 flex flex-col gap-4'>
                                <span>
                                    Configure the Pricing for the promotion of each tour
                                </span>
                                <hr />
                                {openEditPromotion ? (
                                    <div className='flex items-end justify-center'>
                                        <span className='text-3xl font-medium'>
                                            {formatNumber(promotion)}/
                                        </span>

                                        <span className='text-gray-500'>2 weeks</span>
                                    </div>
                                )
                                    : (
                                        <div className='flex items-end justify-center'>
                                            <div>
                                                <input type="text" className='text-3xl font-medium p-0 w-40 border-b border-0 border-black focus:outline-none 
                                    text-end'
                                                    value={formatNumberWithCommas(editPromotion)} onChange={(e) => {
                                                        const newValue = e.target.value.replace(
                                                            /,/g,
                                                            ""
                                                        )
                                                        setEditPromotion(newValue)
                                                    }} />
                                            </div>
                                            <span className='text-3xl font-medium ml-1'>
                                                đ/
                                            </span>
                                            <span className='text-gray-500'>2 weeks</span>
                                        </div>
                                    )
                                }


                            </div>
                        </div>
                        <div className='rounded-lg bg-white shadow-custom-card-mui h-52'>
                            <div className='p-4 flex justify-between'>
                                <span className='font-medium text-xl'>
                                    Commission
                                </span>
                                {openEditCommission ? (
                                    <button type='button' onClick={handleOpenEditCommission} className=' bg-blue-600 text-white px-4 rounded-md flex  items-center gap-1'>
                                        <FiEdit />
                                        Edit
                                    </button>
                                ) : (
                                    <button type='button' onClick={handleCloseEditCommisstion} className=' bg-yellow-600 text-white px-4 rounded-md flex  items-center gap-1'>
                                        <FiEdit />
                                        Save
                                    </button>
                                )}
                            </div>
                            <hr />
                            <div className='p-4 flex flex-col gap-4'>
                                <span>
                                    Commission percentage that the system receive for each booking </span>
                                <hr />
                                <div className='flex items-end justify-center'>
                                    {openEditCommission ? (
                                        <span className='text-3xl font-medium'>
                                            {(commision * 100)}%
                                        </span>
                                    ) : (
                                        <>
                                            <input type="number" className='text-3xl font-medium p-0 w-10 border-b border-0 border-black focus:outline-none 
                                    text-end'
                                                value={parseInt(editCommission, 10)} onChange={(e) => {
                                                    setEditCommission(e.target.value)
                                                }} /> <span className='text-3xl font-medium'>%</span>
                                        </>
                                    )}


                                </div>

                            </div>
                        </div>
                        <div className='rounded-lg bg-white shadow-custom-card-mui'>
                            <div className='p-4 flex justify-between items-center' >
                                <span className='font-medium text-xl'>
                                    Banner
                                </span>
                                {
                                    openEditBanner ? (
                                        <button type='button' onClick={handleOpenEditBanner} className=' bg-blue-600 text-white px-4 rounded-md flex  items-center gap-1'>
                                            <FiEdit />
                                            Edit
                                        </button>
                                    ) : (
                                        <button type='button' onClick={handleUploadAll} className=' bg-yellow-600 text-white px-4 rounded-md flex  items-center gap-1'>
                                            <FiEdit />
                                            Save
                                        </button>
                                    )
                                }
                            </div>
                            <hr />
                            <div className='p-4'>
                                {openEditBanner ? (
                                    <img src={banner} alt="dont find" className='h-56 object-cover rounded-lg' />

                                ) : (
                                    <div className='h-56 flex flex-col items-center  justify-center'>
                                        <div>
                                            <input type="file" multiple onChange={handleFileInputChange} />

                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                </Container>
            )}
        </>
    );
}
