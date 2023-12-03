import { Upload, message } from 'antd';
import { FiEdit } from 'react-icons/fi';
import { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';

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

    const [files, setFiles] = useState(null);
    const [loadingImg, setLoadingImg] = useState(false);

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
    const handleCloseEditPromotion = () => {
        setLoading(true)
        console.log(editPromotion)
        axiosInstance.patch(`${BASE_URL}/global/boost-price`,
            {
                price: parseInt(editPromotion, 10)
            }).then((response) => {
                console.log(response)
                setLoading(false);
                setOpenEditPromotion(true);
            }).catch(
                (error) => {
                    console.log(error)
                    setLoading(false);
                    setOpenEditPromotion(true);
                }
            )
    }

    const handleCloseEditCommisstion = () => {
        setLoading(true)
        axiosInstance.patch(`${BASE_URL}/global/commission-rate`,
            {
                commision: parseInt(editCommission, 10) / 100
            }).then((response) => {
                console.log(response)
                setLoading(false);
                setOpenEditCommission(true);
            }).catch(
                (error) => {
                    console.log(error)
                    setLoading(false);
                    setOpenEditCommission(true);
                }
            )
    }


    const handleChange = async (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            setLoadingImg(false);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
            setLoadingImg(false);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 8;
        if (!isLt2M) {
            message.error('Image must be smaller than 8MB!');
        }

        // Nếu hình ảnh hợp lệ, chuyển đổi thành định dạng file
        if (isJpgOrPng && isLt2M) {
            convertToBlob(file).then((blob) => {
                setFiles(blob);
            });
        }

        return false; // Không tự động upload, vì chúng ta sẽ xử lý file sau khi chuyển đổi
    };

    const convertToBlob = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(new Blob([reader.result], { type: file.type }));
        };
        reader.readAsArrayBuffer(file);
    });

    const handleUpload = async () => {
        if (files) {
            try {
                setLoadingImg(true);

                // Sử dụng axios hoặc phương thức gửi file của bạn để gửi file lên server
                const formData = new FormData();
                formData.append('file', files[0]); // Chắc chắn chỉ lấy một file

                try {
                    const response = await axiosInstance.patch(`${BASE_URL}/global/banner`, {}, formData);
                    console.log('Upload success:', response);
                } catch (error) {
                    console.error('Error uploading file:', error);
                    if (error.response) {
                        console.error('Server error details:', error.response.data);
                    }
                }

                setLoadingImg(false);
            } catch (error) {
                console.error('Error uploading file:', error);
                setLoadingImg(false);
                message.error('File upload failed.');
            }
        }
    };



    const uploadButton = (
        <div>
            {loadingImg ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
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
    }, [commision, loadingAccProvider, promotion, setBanner, setCommision, setPromotion, loading]);

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
                                            <input type="number" min={5} max={100} className='text-3xl font-medium p-0 w-10 border-b border-0 border-black focus:outline-none 
                                    text-end'
                                                value={formatNumberWithCommas(parseInt(editCommission, 10) * 100)} onChange={(e) => {
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
                                <button type='button' className=' bg-blue-600 text-white px-4 rounded-md flex  items-center gap-1'>
                                    <FiEdit />
                                    Edit
                                </button>
                            </div>
                            <hr />
                            <div className='p-4'>
                                <img src={banner} alt="dont find" className='h-56 object-cover rounded-lg' />
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    onChange={handleChange}
                                    beforeUpload={beforeUpload}
                                >
                                    {files ? (
                                        <img src={URL.createObjectURL(files)} alt="avatar" style={{ width: '100%' }} />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                                <button type="button" onClick={handleUpload} disabled={!files}>
                                    Upload to Server
                                </button>
                            </div>
                        </div>
                    </div>

                </Container>
            )}
        </>
    );
}
