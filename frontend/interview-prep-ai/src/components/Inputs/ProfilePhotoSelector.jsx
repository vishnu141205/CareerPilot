import React from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import { useRef, useState } from "react";



const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {

    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
    // Update the image state
        setImage(file);

        // Generate preview URL from the file
        const preview = URL.createObjectURL(file);
        if(setPreview) {
        setPreview(preview)
        }
        setPreviewUrl(preview);
    }
    }
    const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);

    if(setPreview) {
        setPreview(null);
    }
    }

    const onChooseFile = () => {
        inputRef.current.click();
    }


return <div className="flex justify-center mb-6">
    <input 

        type="file"
        accept="image/*"
        ref={inputRef}  
        onChange={handleImageChange}
        className="hidden"
    />

    {!image ? (
        <div onClick={onChooseFile} className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer relative">
            <LuUser className="text-4xl text-gray-500" />

            <button className="w-8 h-8 flex items-center justify-center bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer" 
            type="button"
            onClick={onChooseFile}>
                <LuUpload />
            </button>
        </div>
    ) : (
        <div className="relative">
            <img src={preview || previewUrl} alt="Profile" className="w-20 h-20 object-cover rounded-full" />
            <button className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer" 
            onClick={handleRemoveImage}
            type="button">
                <LuTrash />
            </button>
        </div>
    )}
</div>;
}
export default ProfilePhotoSelector;