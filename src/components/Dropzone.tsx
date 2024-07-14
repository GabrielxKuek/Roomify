import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onImageDropped: (file: File) => void;
  userUploadedImage?: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({
  onImageDropped,
  userUploadedImage = false,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onImageDropped(acceptedFiles[0]);
    },
    [onImageDropped]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (userUploadedImage) return null;

  return (
    <div
      className="absolute z-50 flex w-full text-gray-500 text-sm text-center cursor-pointer select-none p-2 h-44"
      {...getRootProps()}
    >
      <div className="m-auto">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Optional: Drag and drop a starting image here</p>
        )}
      </div>
    </div>
  );
};

export default Dropzone;
