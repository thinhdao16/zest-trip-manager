import * as React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { Rating } from '@mui/material';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';

import LoadingModal from 'src/loading/LoadingModal';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "100vw",
    bgcolor: 'background.paper',
    boxShadow: 210,
    zIndex: 2,
    height: "100vh"
};
// eslint-disable-next-line react/prop-types
export default function ModalListProviderTour({ openModal, setOpenModal, idProvider }) {

    const [loading, setLoading] = React.useState(false)

    const handleCloseCancel = () => setOpenModal(false);


    const [dataProvider, setDataProvider] = React.useState()
    console.log(dataProvider)

    React.useEffect(() => {
        setLoading(true);
        axiosInstance
            .get(`${BASE_URL}/tour/provider/list/${idProvider}`, {
            })
            .then((response) => {
                setDataProvider(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, [idProvider]);
    return (
        <div>
            {loading ? (
                <LoadingModal loading={loading} />
            )
                : (
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
                                            <span className=" text-2xl font-bold">List tour</span>
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
                                        <div className="flex flex-col gap-5 min-h-[20vh] max-h-[100vh] overflow-auto global-scrollbar pt-16 pb-56 p-4">
                                            {
                                                dataProvider?.total_count > 0 ? (
                                                    dataProvider?.tours?.map((tour, index) => (
                                                        <div className='p-4 rounded-md shadow-custom-0 bg-white flex items-center gap-4' key={index}>
                                                            <img src={tour?.tour_images?.[0]} alt="" className='w-24 h-24 rounded-md object-cover' />
                                                            <div className='flex flex-col'>
                                                                <span className='font-medium'>
                                                                    {tour?.name}
                                                                </span>
                                                                <span className='block'>
                                                                    {tour?.address_name},{" "}
                                                                    {tour?.address_ward},{" "}
                                                                    {tour?.address_district},{" "}
                                                                    {tour?.address_province},{" "} {tour?.address_country}
                                                                </span>
                                                                <span>
                                                                    {tour?.duration_day}/day {tour?.duration_night}/night
                                                                </span>
                                                                <Rating name="half-rating-read" defaultValue={tour?.average_rating} precision={0.5} readOnly />
                                                            </div>

                                                        </div>
                                                    ))) : (
                                                    <div className='w-full h-[90vh] flex items-center justify-center'>
                                                        <span className='text-3xl font-bold' >No tour</span>

                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    {/* <div
                                        className="flex gap-5 absolute bottom-0 bg-white w-full justify-center p-4 rounded-b-xl border border-solid border-gray-200"
                                        style={{ marginBottom: "-1px    " }}
                                    >
                                        {dataProvider?.status !== 'REJECT' && dataProvider?.status !== 'ACCEPTED' && (
                                            <button
                                                className="px-6 py-2 bg-gray-300 rounded-lg text-gray-600 font-medium"
                                                type='button'
                                                onClick={() => handleCloseUpdate("REJECT")}
                                            >
                                                Reject
                                            </button>
                                        )}
                                        {dataProvider?.status !== 'ACCEPTED' && (
                                            <button
                                                className="px-6 py-2 bg-blue-600 rounded-lg text-white font-medium"
                                                type='button'

                                                onClick={() => handleCloseUpdate("ACCEPTED")}
                                            >
                                                Accept
                                            </button>)}
                                        {(dataProvider?.status !== 'BANNED' || dataProvider?.status !== 'PROGESSING') && dataProvider?.status === 'ACCEPTED' && (
                                            <button
                                                className="px-6 py-2 bg-yellow-300 rounded-lg text-yellow-900 font-medium"
                                                type='button'
                                                onClick={() => handleCloseUpdate("BANNED")}
                                            >
                                                Ban
                                            </button>
                                        )}

                                        {(dataProvider?.status !== 'DISABLED' || role !== "Staff") && dataProvider?.status !== 'PROCESSING' && dataProvider?.status !== 'REJECT' && (
                                            <button
                                                className="px-6 py-2 bg-red-300 rounded-lg text-red-900 font-medium"
                                                type='button'

                                                onClick={() => handleCloseUpdate("DISABLED")}
                                            >
                                                Disable
                                            </button>
                                        )}
                                    </div> */}
                                </div>

                            </Box>
                        </Fade>
                    </Modal>
                )
            }
        </div>
    );
}