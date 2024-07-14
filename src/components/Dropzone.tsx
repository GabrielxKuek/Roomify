import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onImageDropped: (file: File) => void;
  predictions?: any[];
  userUploadedImage?: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({
  onImageDropped,
  predictions = [],
  userUploadedImage = false,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onImageDropped(acceptedFiles[0]);
    },
    [onImageDropped]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (predictions.length || userUploadedImage) return null;

  return (
    <div
      className="absolute z-50 flex w-full h-full text-gray-500 text-sm text-center cursor-pointer select-none"
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
